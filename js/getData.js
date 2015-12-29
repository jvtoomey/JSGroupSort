function getData() {

	//clear out the data from the previous run
	window.headerData='';
	window.reportData='';
	window.dataForChildWindow = '';
	
	var criteria = 'Pass in some criteria for the query, maybe date range';
	
	var asyncPromise = ajaxQueryDB(criteria, openModal, closeModal);
	asyncPromise
		.then(function(data) {
			
			var rawData = data;
			var returnedArr = JSON.parse(rawData);
			window.headerData = returnedArr[0];
			window.reportData = returnedArr[1];

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
		})
}