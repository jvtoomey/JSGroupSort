//global vars. 
window.reportData; //this is a raw array of the data records. If they chose grouping, then this array is converted to a JS object hierarchy.
window.headerData; //this is an array of the fields that the query returned. I put them here so I can list them at the top as columns.
window.dataForChildWindow;
window.reportParameters;

$(document).ready(function(){
	//This converts the controls to jquery UI date pickers.
	$('#fromDate').datepicker();				
	$('#toDate').datepicker();
	
	//this is in getData.js
	$('#btnGetData').click(getData);
	
	// this is in openReport.js
	$('#btnOpenReport').click(openReport);
	
	//this is in openExcelPasteable.js
	$('#btnOpenExcelPasteable').click(openExcelPasteable);
	
	//Set the title on opening the control panel
	window.reportParameters = {reportTitle: "Vehicle Report"};
});