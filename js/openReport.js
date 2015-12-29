function openReport() {
	
	var html='';
	var otherCols;
	var tree;
	var myReportData = _.clone(window.reportData, true); //make a deep clone of the data. I clone it so the original can be resorted/regrouped if they want to re-run the report.
	
	var groupingColumns = $('#groupHeaders').val();
	var sortColumns = $("#sortColumns").val();
	
	//first perform sorting
	if (!_.isEmpty(sortColumns)) {
		sortColumns = sortColumns.split("~~~");	
		
		var sortOnThese = [];
		var sortOrder = [];
		
		//if the field is a date like this "03/15/2015", you need to reformat the date so it's alphabetically sortable by date, like this: "2015-03-15". Either do this in the query prior to passing the data back, or reformat the date in Javascript.
		
		for (var i=0; i < sortColumns.length; i++) {
			var val = sortColumns[i];
			if (val.indexOf('_DirAsc') !== -1) {
				sortOnThese.push(val.replace('_DirAsc', ''));
				sortOrder.push('asc');
			}
			else {
				sortOnThese.push(val.replace('_DirDesc', ''));
				sortOrder.push('desc');
			}
		}		
		
		myReportData = _.sortByOrder(myReportData, sortOnThese, sortOrder);		
	}

	//did they select anything from the list?
	if (_.isEmpty(groupingColumns)) {
		//they're not grouping, so use all the columns in the dataset.
		otherCols = window.headerData;
		tree = myReportData;
	}
	else {
		//they selected grouping columns, so remove these from the header list.
		groupingColumns = groupingColumns.split("~~~");		
		otherCols = window.headerData.filter(function(val){if (groupingColumns.indexOf(val)===-1) return val;});
		
		//perform grouping
		var nest = function (seq, keys) {

			//this part exits out of the recursive function once you've run out of keys.
			if (!keys.length)
				return seq;
			var first = keys[0];
			var rest = keys.slice(1);
			return _.mapValues(_.groupBy(seq, first), function (value) { 
				return nest(value, rest)
			});
		};
		tree = nest(myReportData, groupingColumns);
	}

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
            
            //otherwise, loop over each of the properties at this level and call myself.
			//These are grouping headers.
            for (var prop in subset) {
                html+="<tr class='active'><td colspan=" + otherCols.length + "><h" + (ptr+3) + ">" + _.repeat('&nbsp;', (ptr*4)) + groupingColumns[ptr] + ": " + prop + '<h' + (ptr+3) + '</td></tr>'; //this is the grouped value, which is the header.
	               var subtree = subset[prop];
	               //I have to clone the pointer or the value next changes, b/c JS just uses byref.
	               var newPtr=_.clone(ptr, true);
	               newPtr++;
	               recurseOverJson(newPtr, subtree);
            }
        }
            
        recurseOverJson(0, tree);
	}
	html+='</table>';
	
	//the var dataForChildWindow gets picked up in the document.ready routine of the child window.
	window.dataForChildWindow = "<h1>" + window.reportParameters.reportTitle + "</h1>" + html;

	var win = window.open("Output.htm", "_blank");
}