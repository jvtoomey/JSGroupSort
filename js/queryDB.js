function ajaxQueryDB(sqlToRun, fncToRunBefore, fncToRunAfter) {

	//console.log(sqlToRun);

	//I don't always pass a function here, so I need to check if it's null.
	//So far I'm only passing the function to open the modal window.
	if (typeof fncToRunBefore !== 'undefined') {
		fncToRunBefore();
	}
	
	//when sending the criteria to the web service, you have to use stringify to convert it to a JSON string. You can't just send it as a javascript object.

	var defer = Q.defer();

	var request = new XMLHttpRequest();
	
	//THIS IS HOW YOU WOULD SEND THE REQUEST TO A REAL WEB SERVICE
	/*
	request.open('POST', 'http://WEBSERVICE_URL_HERE', true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.onreadystatechange = function(){
		if (request.readyState === 4 && request.status === 200){
			defer.resolve(JSON.parse(request.responseText));
			if (typeof fncToRunAfter !== 'undefined') {
				fncToRunAfter();
			};
		}
		else if (request.readyState === 4 && request.status !== 200){
			defer.reject('error');
			if (typeof fncToRunAfter !== 'undefined') {
				fncToRunAfter();
			};
		}			
	};		
	request.send(JSON.stringify( {sqlQuery: sqlToRun} ));
	*/
	
	//DELETE THIS CODE WHEN QUERYING A REAL DATABASE; YOU USE THE ABOVE CODE INSTEAD.
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	// Simulate a long-running database call.
	window.setTimeout( function(){
		//1st array is table headers, 2nd array is flat recordset.
		//MY DATA IS COMING BACK FROM A TERMINAL SO IT'S VERY RAW AND NEEDS A LOT OF PARSING. HOPEFULLY YOURS WILL BE NICELY-FORMATTED JSON.
		//INSIDE GETDATA.JS THERE IS A CALL TO PARSERAWDATA.JS THAT CONVERTS THIS RAW STRING TO 2 ARRAYS, ONE WITH THE HEADERS, AND THE NEXT WITH THE DATA ROWS.
		var returnedData = "ZXZ MAKE ZXZ MODEL ZXZ CATEGORY ZXZ COLOR BEG_OF_ROW Toyota ~~~ Sienna ~~~ Minivan ~~~ Black ~~~ BEG_OF_ROW Ford ~~~ F150 ~~~ Truck ~~~ White ~~~ BEG_OF_ROW Chevrolet ~~~ Colorado ~~~ Truck ~~~ White ~~~ BEG_OF_ROW Chevrolet ~~~ Malibu ~~~ Sedan ~~~ Blue ~~~ BEG_OF_ROW Ford ~~~ F150 ~~~ Truck ~~~ White ~~~ BEG_OF_ROW Ford ~~~ Transit ~~~ Minivan ~~~ White ~~~ BEG_OF_ROW Honda ~~~ Accord ~~~ Sedan ~~~ Silver ~~~ BEG_OF_ROW Honda ~~~ Odyssey ~~~ Minivan ~~~ White ~~~ BEG_OF_ROW Toyota ~~~ Sienna ~~~ Minivan ~~~ Black ~~~ BEG_OF_ROW Toyota ~~~ Tundra MaxCab ~~~ Truck ~~~ Red ~~~ BEG_OF_ROW Toyota ~~~ Tundra Regular Cab ~~~ Truck ~~~ Blue ~~~ 11 records selected";
		fncToRunAfter();
		defer.resolve(returnedData);
		}, 2000);
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	return defer.promise;	
}