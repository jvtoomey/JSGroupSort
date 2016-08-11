function step1_GetReport(passedInPrimaryDeferred) {
	
	//I broke these into subfunctions so they can call each other one by one when the asynchronous function is done.
	//I used to use this at the end, but it's much slower for some reason.
	//$.when(asyncPromise1, asyncPromise2).done(setupCriteriaFields);
	
	var openReportFile = function() {
		//get the querystring name, which should be the report name.	
		var queryString = window.location.search.substring(1);	
		
		//if there is no querystring, show error.
		if (queryString === '') {
			alert('There must be a report name passed in');
			//$(".container").hide();
			return;
		}

		//this splits the variables
		var sURLVariables = queryString.split('&');
		var sParameterName = sURLVariables[0].split('=')[1];

		//get my current URL
		var pth = [location.protocol, '//', location.host, location.pathname].join('');
		var url = window.location.pathname;
		//this finds the current path of ReportViewer.htm, then replaces the file name with the file name of the template.
		var filename = url.substring(url.lastIndexOf('/')+1);
		var customReportPath = pth.replace(filename, 'urpt/' + sParameterName + '?forceRefresh=' + Math.random()); //the query string is to force it to give me a new file everytime. Otherwise the web browser wants to give a cached copy of the file.
		var standardReportPath = pth.replace(filename, 'rpt/' + sParameterName + '?forceRefresh=' + Math.random()); //the query string is to force it to give me a new file everytime. Otherwise the web browser wants to give a cached copy of the file.

		//get the settings from the file.
		var getFileContents = function() {
			var defer = Q.defer();
			var request = new XMLHttpRequest();
			//the "true" is to make it async (which is the default anyway).	
			request.open('GET', customReportPath, true);
			request.onreadystatechange = function(){
				if (request.readyState === 4 && request.status === 200){
					defer.resolve(request.responseText);
				}
				else if (request.readyState === 4 && request.status !== 200){
					if (request.status === 404) {
						//the file wasn't found, so try again but with the standard path.
						var request2 = new XMLHttpRequest();
						request2.open('GET', standardReportPath, true);
						request2.onreadystatechange = function(){
							if (request2.readyState === 4 && request2.status === 200){
								defer.resolve(request2.responseText);
							}
							else if (request2.readyState === 4 && request2.status !== 200){
								if (request2.status === 404) {
									//that wasn't found either, so reject the promise.
									passedInPrimaryDeferred.reject('File not found error (404)');
								}
								else {
									passedInPrimaryDeferred.reject('Error. Request.status was ' + request2.status);
								}
							}
						}
						request2.send();
					}
					else {
						passedInPrimaryDeferred.reject('Error. Request.status was ' + request.status);
					}
				}
			}
			request.send();
			return defer.promise;
		};
		
		getFileContents()
		.then(function(fileContents) {
			
			//this regexp breaks apart the report file's contents into the script part and the HTML part.
			//I can't just use .+ because that doesn't grab newlines characters. The form [\s\S] says to grab a single whitespace character including linefeed (that's the \s), OR any character that's not whitespace (that's the \S).
			//I use an asterisk rather than a dot b/c the asterisk says 0 or more, whereas dot says 1 or more.
			var regexp = new RegExp(/(<script>)([\s\S]+)(<\/script>)([\s\S]*)/);
			var match = regexp.exec(fileContents);
			if (!_.isEmpty(match)) {
				//match[0] will be the entire string.
				//match[1] will be the opening tag, which I don't need.
				//match[2] will be the Javascript code (hence the search for the "<script>" tags).
				//match[3] will be the closing tag, which I don't need.
				//match[4] will be the rest of the report, which is the mustache template, if there is one.

				var data;
				
				if (match.length === 5) {
					//replace carriage returns. This will confuse my code in openReport.js if it thinks the template isn't empty b/c of carriage returns.
					var templateString = match[4];
					templateString = templateString.replace(/[\r\n]/g, '');
					window.mustacheTemplate =  templateString;
				}
				else {
					window.mustacheTemplate = '';
				}
				
				//run the code that's in the <script> tags from the report.
				//This will produce variables that I then use below.
				eval(match[2]);
			}
		})
	};
	
	openReportFile();
	return passedInPrimaryDeferred.promise;
}

function step2_SetupReport() {

	//I pause a second here for the eval above to be processed. Otherwise, sometimes the new window.* variables that are set in the report file won't be available yet.
	setTimeout(function()
    {
		$("#reportTitle").text(window.reportParameters.reportTitle);
		$("#reportDesc").text(window.reportParameters.reportDesc);		
		
		//if this report has a custom setup function, use that; otherwise, use the default code.
		if (window.customSetup) {
			window.customSetup();
		}
		else {
			var setupCriteria = function(idx) {
				//I call this function recursively, which is why I need a bailout so I don't get in an infinite loop.		
				if (idx === window.reportParameters.searchCriteria.length) {
					//now show the query button b/c it's okay to run now.
					$("#btnGetData").show();
					return;
				}

				$("#searchControls").append("<h5>" + window.reportParameters.searchCriteria[idx].desc + "</h5>");
				
				//does this criteria type require a query?
				var criteria = window.reportParameters.searchCriteria[idx];
				var criteriaType = criteria.dataType; //This will be a string such as "date", "datetime", "BUILTIN_APAGNCY"
				var criteriaCreator = window.criteriaTypes[criteriaType]; //this will be an object that has a createControl function (always) and a sqlQuery property (only for the builtin ones)
				
				var doCreate = function(results) {
					//call the function that creates the onscreen control.
					criteriaCreator.createControl(idx, $("#searchControls"), results);
					
					//I have to clone the pointer or the value next changes, b/c JS just uses byref.
					//This clone function comes from lodash.
					var newPtr=_.clone(idx, true);
					newPtr++;
					setupCriteria(newPtr);
				}
				
				if (criteriaCreator.sqlQuery) {
					var asyncPromise = ajaxQueryDB(criteriaCreator.sqlQuery, openModal, closeModal);	
					
					asyncPromise
						.done ( function (returnedData) { 

						var returnedArray = parseRawData(returnedData); 
						//note I'm setting it to the 2nd item of the array. The first one is the column headers, which I don't need for this (I do use it when I run the report query).
						//The "results" property doesn't exist on the object but I'm creating it here.
						doCreate(returnedArray[1]);
					});
				}
				else {
					doCreate();
				}
			};	
			
			//I pass an index b/c this function calls itself recursively.
			setupCriteria(0);	
		}

    }, 1000);
	
}