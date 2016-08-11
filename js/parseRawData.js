function parseRawData(data) {

	//MY DATA IS COMING BACK FROM A TERMINAL SO IT'S VERY RAW AND NEEDS A LOT OF PARSING,
	//BUT IF YOURS IS IN NICELY FORMATTED JSON THEN YOU MAY NOT NEED THIS FUNCTION AT ALL, OR AT LEAST JUST A MINIMAL
	//TREATMENT TO SPLIT INTO THE HEADER COLUMNS AND THE DATA ITSELF.
	
	//This splits the array. I can't use \n because it has those all over the place due to the 80-char terminal limit. I put the keyword BEG_OF_ROW in there to indicate a row begins.
	
	//replace the little note at the bottom.
	data = data.replace(/\d+ records selected/g, '');
	data = data.replace(/\d+ record selected/g, '');

	//get the column names.
	var recArray = data.split(/BEG_OF_ROW/ig);
	var headerRow = recArray[0];
	//remove the newlines. The m means multiline.
	headerRow = headerRow.replace(/(\r\n|\n|\r)/gm,"");
	//remove the dashes.
	headerRow = headerRow.replace(/-/g,"");	
	//remove the spaces.
	headerRow = headerRow.replace(/ /g,"");	
	
	//split the string into pieces on the separator. The split returns an array, then the filter removes the empty strings.
	var headerCols = headerRow.split(/ZXZ/g).filter(function(n){ return n !== '' });
	
	var results = [];
	
	var recArray = data.split(/BEG_OF_ROW/ig);
	
	//I start at 1 b/c the first row is the header row.
	for(var i = 1; i < recArray.length; i++) {
		var singleRow = recArray[i];
		//remove the newlines.
		singleRow = singleRow.replace(/(\r\n|\n|\r)/gm,"");
		//split the string into pieces on the "~~~" separator.
		var fields = singleRow.split('~~~');
		var rec = {};
		for (var j=0; j<fields.length; j++) {
			var propName = headerCols[j];
			//set the property using the col name
			var propVal = fields[j];
			//trim it
			propVal = propVal.replace(/^\s+|\s+$/g, '');
			rec[propName] = propVal;
		}
		results.push(rec);
	}
		//console.log(results);
				
		return [headerCols, results];
}
 
