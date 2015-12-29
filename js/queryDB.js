function ajaxQueryDB(criteria, fncToRunBefore, fncToRunAfter) {

	fncToRunBefore();
	
	//Use something like the code below when actually querying the database:
	/*
		var d = Q.defer();

		var request = new XMLHttpRequest();
		request.open('POST', 'http://url/to/web/service/', true);
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		request.onreadystatechange = function(){
			if (request.readyState === 4 && request.status === 200){
				d.resolve(request.responseText);
				fncToRunAfter();
			}
			else if (request.readyState === 4 && request.status !== 200){
				d.reject('error');
				fncToRunAfter();				
			}			
		};		
		request.send(JSON.stringify( {queryCriteria: criteria}));
		return d.promise;
	
	*/
		
	// Simulate a long-running database call.
	var d = Q.defer();
	
	window.setTimeout( function(){
		//1st array is table headers, 2nd array is flat recordset.
		var returnedData = JSON.stringify([ ['Make', 'Model', 'Category', 'Color'], [{Make: 'Toyota', Model: 'Sienna', Category: 'Minivan', Color: 'Black'}, {Make: 'Ford', Model: 'F150', Category: 'Truck', Color: 'White'}, {Make: 'Chevrolet', Model: 'Colorado', Category: 'Truck', Color: 'White'}, {Make: 'Chevrolet', Model: 'Malibu', Category: 'Sedan', Color: 'Blue'}, {Make: 'Ford', Model: 'F150', Category: 'Truck', Color: 'White'}, {Make: 'Ford', Model: 'Transit', Category: 'Minivan', Color: 'White'}, {Make: 'Honda', Model: 'Accord', Category: 'Sedan', Color: 'Silver'}, {Make: 'Honda', Model: 'Odyssey', Category: 'Minivan', Color: 'White'}, {Make: 'Toyota', Model: 'Sienna', Category: 'Minivan', Color: 'Black'}, {Make: 'Toyota', Model: 'Tundra MaxCab', Category: 'Truck', Color: 'Red'}, {Make: 'Toyota', Model: 'Tundra Regular Cab', Category: 'Truck', Color: 'Blue'}] ]);
		fncToRunAfter();
		d.resolve(returnedData);
		}, 2000);
	
	return d.promise;
}


