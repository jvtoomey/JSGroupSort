function getData() {

	//clear out the data from the previous run
	window.headerData='';
	window.reportData='';
	window.dataForChildWindow = '';
	window.customNotesForChildWindow = '';
	
	//the sql variable is set in the report.txt file
		
	//determine how many queries are here (ie, is it a union query?)
	var numberOfUnions = (window.reportParameters.sql.toLowerCase().match(/ union /g) || []).length;

	//add 1 b/c I just counted how many unions there are, so the # of queries will be 1 more than that.
	numberOfUnions++;

	var newSql = window.reportParameters.sql;	
	
	for (var unionCounter = 0; unionCounter < numberOfUnions; unionCounter++) {
		
		var whereClause = '';
		var whereClauseCount = 0;

		for (var criteriaCounter = 0; criteriaCounter < window.reportParameters.searchCriteria.length; criteriaCounter++) {
			
			//call the function that makes each data piece's where clause.
			var dataType = window.reportParameters.searchCriteria[criteriaCounter].dataType;
			var whereClauseCreator = window.criteriaTypes[dataType]; //this will be an object that has a constructWhereClause function
			
			//get the field name from the array
			var fieldName = window.reportParameters.searchCriteria[criteriaCounter].fieldName[unionCounter];

			//now run the function.
			var result = whereClauseCreator.constructWhereClause(criteriaCounter, fieldName);
			
			if (!result.clean) {
				alert(result.errorMsg);
				return;
			}
			
			if (result.clean && result.isUsed) {
				if (whereClauseCount === 0) {
					whereClause += ' where ' + result.whereClausePiece;
				}
				else {
					whereClause += ' and ' + result.whereClausePiece;
				}
				whereClauseCount++;
			}
		}

		//I add 1 here b/c the names WHERE_CLAUSE start at 1.
		var placeholder = 'WHERE_CLAUSE' + (unionCounter+1);
		newSql = newSql.replace(placeholder, whereClause);
		
		//add the where clauses to the custom notes field.
		if (window.reportParameters.includeCustomNotes) {
			window.customNotesForChildWindow += '<br>' + whereClause;			
		}
	}

	//console.log(newSql);
	
	//I need this to append any hard-coded sql values to the query.
	if (window.customizeSqlBeforeSending) {
		newSql = window.customizeSqlBeforeSending(newSql);
	}
	
	var asyncPromise = ajaxQueryDB(newSql, openModal, closeModal);
	
	var ifSuccessful = function(data) {

		var rawData = data;
		
		//check if there was an error message.
		var errChk = /error\(.+/;
		if (rawData.match(errChk)) {
			var msg = errChk.exec(rawData);
			alert("Problem running query: \n" + msg);
			return;
		}

		var returnedArr = parseRawData(rawData);
		window.headerData = returnedArr[0];
		window.reportData = returnedArr[1];
		
		if (reportData.length === 0) {
			alert('No data returned.');
			return;
		}
		
		//if there's a post-processor function, run it to update the data.
		if (window.postProcessor) {
			window.postProcessor();
		}				

		//add option items
		for (var i=0; i<window.headerData.length; i++) {
				$('#groupingSelector')
				.append($("<option></option>")
				.attr("value", window.headerData[i])
				.text(window.headerData[i])); 
		}

		//make the object array for Selectize.
		var groupHeaderItems = [];
		var sortOrderItems = [];
		//the results var is passed back to this function after it is generated when the db is queried.
		window.headerData.forEach(
			function(rec) {  
				var singleItem = { myKey: rec, myVal: rec };			
				groupHeaderItems.push(singleItem);					
		});
		
		window.headerData.forEach(
			function(rec) {  
				var singleItem = { myKey: rec + '_DirAsc', myVal: rec };			
				sortOrderItems.push(singleItem);					
		});
		

		//turn the groupHeaders into a selectize.
		$("#sortColumns")
			.selectize({
				plugins: ['remove_button'], 
				valueField: 'myKey', 
				labelField: 'myVal',
				searchField: ['myVal'], 
				options: sortOrderItems, 
				delimiter: '~~~',
				render: {
					item: function(data, escape) {
						var direction = data.myKey.replace(/.+_Dir/, '');
						var html = '<div id="' + data.myKey + '">';
						html += '<span>' + data.myVal + '</span>';
						html += '<img src="./img/arrow' + direction + '.png" onClick="changeSortOrder(this);" /></div>';
						return html;
					}
				}
			});
	
		//turn the groupHeaders into a selectize.
		$("#groupHeaders")
			.selectize({
				plugins: ['remove_button'], 
				valueField: 'myKey', 
				labelField: 'myVal',
				searchField: ['myVal'], 
				options: groupHeaderItems, 
				delimiter: '~~~'
			});
	
		//this is to clear the selections from the last run, if there was one.
		$("#sortColumns")[0].selectize.clear(true);
		$("#groupHeaders")[0].selectize.clear(true);

		$('#queryDashboard').modal('show'); //this is bootstrap syntax
		
		//hide the option to group if that option is set. I usually do this if it has a mustache template.
		if (window.reportParameters.hideGroupControls) {
			$("#groupHeadersControls").hide();
		}
		else {
			$("#groupHeadersControls").show();
		}
		
		if (window.reportParameters.hideSortControls) {
			$("#sortHeadersControls").hide();
		}
		else {
			$("#sortHeadersControls").show();
		}
	};
	
	var ifFailed = function(data) {
		alert('problem with asyncPromise running sql'); 		
	};
	
	//now run them
	asyncPromise.then(ifSuccessful, ifFailed);
}