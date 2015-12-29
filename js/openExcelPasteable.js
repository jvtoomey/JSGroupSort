function openExcelPasteable() {

  	var html = '';

	//header row	
	var numCols = window.headerData.length;
	var numRecs = window.reportData.length;
	
	for (var i=0; i < numCols; i++) {
		html+=window.headerData[i] + '&#9;';
	}
	html+='&#13;&#10;';	
	
	for(var i = 0; i < numRecs; i++) {
		var singleRec = window.reportData[i];
		for (var j = 0; j < numCols; j++) {
			var colName = window.headerData[j];
			html+=singleRec[colName].trim() + '&#9;';
		}

		html+='&#13;&#10;';	
	}

	var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes");
	win.document.body.innerHTML = '<div style="background-color: #E0E0E0; text-align: center;">Before pasting the data in Excel, be sure to highlight all the cells with Select All; otherwise, the pasted data will all go into one cell rather than being split into columns and rows<textarea style="overflow-y: scroll; width: 1200px; height: 800px; resize: none;">' + html + '</textarea></div>';
}
