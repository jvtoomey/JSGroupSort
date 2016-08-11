function openReport() {
	
	var html='';
	var otherCols;
	var tree;
	var myReportData = _.clone(window.reportData, true); //make a deep clone of the data. I clone it so the original can be resorted/regrouped if they want to re-run the report.
	
	var rawGroupingChoices = $('#groupHeaders').val();
	var rawSortingChoices = $("#sortColumns").val();
	var groupingColumns = [];
	var sortingColumns = [];

	//first perform sorting
	if (!_.isEmpty(rawSortingChoices)) {
		
		rawSortingChoices
		.split("~~~")		
		.forEach( function(val) {			
			//this makes an object array and puts it in sortingColumns
			
			var sortItem = {};
			if (val.indexOf('_DirAsc') !== -1) {
				sortItem.column = val.replace('_DirAsc', '');
				sortItem.direction = 'asc';
			}
			else {
				sortItem.column = val.replace('_DirDesc', '');
				sortItem.direction = 'desc';
			}
			
			sortingColumns.push(sortItem);
		});
		
		//since they're going to be sorting, change all fields that look like dates so they're in sortable form.
		//I debated whether to put this in querydb.js instead, but the problem with that is it's tampering with the data instead of just
		//blindly returning it as-is. The problem with doing it here is that if they don't sort on any columns, then dates will look like 03/15/2015,
		//but if they do sort then suddenly it looks like 2015-03-15. That's not really optimal either. One good thing about it being formatted 2 different
		//ways is that it'll serve as a visual reminder to me that I made changes to the format of the data; otherwise I may forget that I'm formatting it at all
		//and start to think that isql just serves it up as 2015-03-15.
		//If I want to keep the format as 03/15/2015, another way to do this would be to use a custom comparator function in Lodash's SortBy rather than using orderBy. The crummy thing is I lose the nice orderBy function which works well.
		//See this answer: http://stackoverflow.com/a/22929627/1359088
		myReportData.forEach(function(singleRow, index, theArray) {
			//loop over the properties of each object (myReportData is an array of objects--each object is a data row).
			//forOwn is a Lodash function to loop over an object's properties.
			_.forOwn(singleRow, function(value, key) {
				
				//if it's a date-only (like 03/15/2015), rearrange it.				
				var regexp = new RegExp(/([0-9][0-9])\/([0-9][0-9])\/([0-9][0-9][0-9][0-9])/);
				if (regexp.test(value)) {
					var match = regexp.exec(value);
					//The function regexp.test just returns true or false. The function regexp.exec returns an array of results, if there are matches. When you do grouping, the first item (match[0]) appears to be the whole string,
					//then match[1] etc are the groupings from the parentheses. That's why I use 1-3 and not 0-2.
					var sortableDate = match[3] + '-' + match[1] + '-' + match[2];
					//now update the array. You can't just update "theArray" b/c that's a copy (byval), not the original (byref)
					myReportData[index][key] = sortableDate;
				}
				
				//do the same if it's a date-time (like 11/10/2015 19:05:00:000)
				regexp = new RegExp(/([0-9][0-9])\/([0-9][0-9])\/([0-9][0-9][0-9][0-9]) ([0-9][0-9]:[0-9][0-9]:[0-9][0-9]):[0-9][0-9][0-9]/);
				if (regexp.test(value)) {
					var match = regexp.exec(value);
					//The function regexp.test just returns true or false. The function regexp.exec returns an array of results, if there are matches. When you do grouping, the first item (match[0]) appears to be the whole string,
					//then match[1] etc are the groupings from the parentheses. That's why I use 1-3 and not 0-2.
					var sortableDateTime = match[3] + '-' + match[1] + '-' + match[2] + ' ' + match[4];
					//now update the array. You can't just update "theArray" b/c that's a copy (byval), not the original (byref)
					myReportData[index][key] = sortableDateTime;
				}				
				
			});
		});
		
		//the 2 map functions here are to extract into an array just the sort columns, and the direction for each.
		//I put these into separate vars for easier debugging.
		var sortArr = _.map(sortingColumns, function(itm) { return itm.column });
		var dirArr = _.map(sortingColumns, function(itm) { return itm.direction });
		myReportData = _.orderBy(myReportData, sortArr, dirArr);
	}

	//did they select anything from the list?
	//The isEmpty function comes from lodash.
	if (_.isEmpty(rawGroupingChoices)) {
		//they're not grouping, so use all the columns in the dataset.
		otherCols = window.headerData;
		tree = myReportData;
	}
	else {
		//they selected grouping columns, so remove these from the header list.
		groupingColumns = rawGroupingChoices.split("~~~");		
		otherCols = window.headerData.filter(function(val){if (groupingColumns.indexOf(val)===-1) return val;});
		
		//perform grouping
		//Found this here: http://stackoverflow.com/questions/10022156/underscore-js-groupby-multiple-values
		//you need lodash to make it work b/c _.mapValues comes from Lodash (which is a fork of Underscore.js, 
		//hence the _ object).
		
		var nest = function (seq, keys) {
			
			//this part exits out of the recursive function once you've run out of keys.
			if (!keys.length)
				return seq;
			var first = keys[0];			
			
			var rest = keys.slice(1);			
			var mappedObject = _.mapValues(_.groupBy(seq, first), function (value) { 
				return nest(value, rest)
			});
			return mappedObject;
		};
		tree = nest(myReportData, groupingColumns);
	}

	//the null is an optional functional to alter it, and the 4 is the number of spaces to indent.
	//console.log(JSON.stringify(tree, null, 4));
	
	var html = '';
	html+='<table class="table">';

	//header row
	html+='<tr>';	
	for (var i=0; i<otherCols.length; i++) {
		html+='<th>' + otherCols[i] + '</th>';
	}
	html+='</tr>';	

	//do this if there are no headers.
	if (_.isEmpty(groupingColumns)) {

		for(var i = 0; i < myReportData.length; i++) {
			var singleRow = myReportData[i];

			html+='<tr>';

			for (var prop in singleRow) {
				html+="<td>" + singleRow[prop] + '</td>';
			}

			html+='</tr>';
		}
	}
	else {
		
		var recurseOverJson = function(ptr, subset) {
            if (ptr === groupingColumns.length) {
                //I've reached the limit of the groupings, so print out values now.
                for (var j=0; j<subset.length; j++) {
	               var singleRow = subset[j];
	               html+='<tr>';
    	           for (var i=0; i<otherCols.length; i++) {
						var colName = otherCols[i];
            	   	html+="<td>" + singleRow[colName] + '</td>';
                	}
                html+='</tr>';                
                }
                
                return;
            }
            
            //***I had to add this code b/c the object properties (since this is basically a dictionary) aren't sorted and don't always come out the way I want them.
			//It tricked me at first b/c it sometimes works coincidentally, but not always, esp if you sort a number column like "01, 02...11".	
			var retrieveInThisOrderArray = [];
			//initially these will be in whatever order it gives them to me. Remember, subset isn't an array, it's an object (associative array, dictionary, whatever), so it gives me these properties in the order it stores them internally, not a sorted order.
			for (var prop in subset) {
				retrieveInThisOrderArray.push(prop);
			}
			
			//if this grouping column is also a sortingColumn, then sort this array so I know the order to write them.
			var currentGroupingColumn = groupingColumns[ptr];
			sortingColumns.forEach(function(singleItem) {
				if (singleItem.column === currentGroupingColumn) {
					if (singleItem.direction === 'asc') {
						retrieveInThisOrderArray = retrieveInThisOrderArray.sort();
					}
					else {
						retrieveInThisOrderArray = retrieveInThisOrderArray.sort().reverse();
					}
				}
			});
			
            //Loop over each of the properties at this level and call myself.
			//These are grouping headers.			
			retrieveInThisOrderArray.forEach(function(singleItem, index, theArray) {
				//console.log(singleItem);
                html+="<tr class='active'><td colspan=" + otherCols.length + "><h" + (ptr+3) + ">" + _.repeat('&nbsp;', (ptr*4)) + groupingColumns[ptr] + ": " + singleItem + '<h' + (ptr+3) + '</td></tr>'; //this is the grouped value, which is the header.
	               var subtree = subset[singleItem];
	               //I have to clone the pointer or the value next changes, b/c JS just uses byref.
				   //This clone function comes from lodash.
	               var newPtr=_.clone(ptr, true);
	               newPtr++;
	               recurseOverJson(newPtr, subtree);				
			});
        }
        	
        recurseOverJson(0, tree);
	}
	html+='</table>';
	
	if (_.isEmpty(window.mustacheTemplate)) {
		//the var dataForChildWindow gets picked up in the document.ready routine of the child window.
		window.dataForChildWindow = "<h1>" + window.reportParameters.reportTitle + "</h1>" + html;
	}
	else {
		//the property "recArray" has to match the mustache repeating section in the report file's HTML section.
		window.dataForChildWindow = Mustache.to_html(window.mustacheTemplate, {recArray: myReportData});
	}

	//the query string is to force a refresh so it doesn't use the cached file
	var win = window.open("Output.htm?forceRefresh=" + Math.random(), "_blank");
}