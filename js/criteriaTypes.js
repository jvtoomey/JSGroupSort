window.criteriaTypes = {
	optionsZeroTo22: '<option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option>',
	optionsZeroTo58: '<option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option>',
	option23: '<option value="23">23</option>',
	option59: '<option value="59">59</option>',
	option23Selected: '<option selected value="23">23</option>',
	option59Selected: '<option selected value="59">59</option>',
	
	datetime: {
		createControl: 	function(i, spanToAppendTo) {
			var html = '<div><label>From:</label><input type="text" id="fromDate' + i + '">';
			html+='<select id="fromHour' + i + '">' + window.criteriaTypes.optionsZeroTo22 + window.criteriaTypes.option23 + '</select>';
			html+='<select id="fromMin' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59 + '</select>';
			html+='<select id="fromSec' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59 + '</select>';
					
			html+='<label>To:</label> <input type="text" id="toDate' + i + '">';
			html+='<select id="toHour' + i + '">' + window.criteriaTypes.optionsZeroTo22 + window.criteriaTypes.option23Selected + '</select>';
			html+='<select id="toMin' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59Selected + '</select>';
			html+='<select id="toSec' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59Selected + '</select>';
			html+='</div>';
			
			spanToAppendTo.append(html);
			
			//run the function that turns them into a date control
			$('#fromDate' + i).datepicker();
			$('#toDate' + i).datepicker();
			//I'm defaulting the date so they don't accidentally run it for the entire table, b/c that could bog down the server.
			$('#fromDate' + i).datepicker("setDate", new Date());
			$('#toDate' + i).datepicker("setDate", new Date());			
		},
		
		constructWhereClause: function(i, fieldName) {
			
			var ctlNameFrom = 'fromDate' + i;
			var ctlHourFrom = 'fromHour' + i;
			var ctlMinFrom =  'fromMin' + i;
			var ctlSecFrom =  'fromSec' + i;
			var ctlNameTo = 'toDate' + i;
			var ctlHourTo = 'toHour' + i;
			var ctlMinTo = 'toMin' + i;
			var ctlSecTo = 'toSec' + i;
			var fromDate;
			var toDate;
			
			//If they chose one of these, ensure they chose the other too.
			var len1 = $("#" + ctlNameFrom).val().length;
			var len2 = $("#" + ctlNameTo).val().length;
			if ((len1 === 0 && len2 > 0 ) || (len1 > 0 && len2 === 0 )) {
				return {clean: false, errorMsg: "You must select both dates, not just one."};
			}
			//they aren't using the dates, so continue on.
			else if (len1 === 0 && len2 === 0) {
				return {clean: true, isUsed: false};
			}
			
			fromDate = $("#" + ctlNameFrom).val() + ' ' + $("#" + ctlHourFrom).val() + ':' + $("#" + ctlMinFrom).val() + ':' + $("#" + ctlSecFrom).val();
			toDate = $("#" + ctlNameTo).val() + ' ' + $("#" + ctlHourTo).val() + ':' + $("#" + ctlMinTo).val() + ':' + $("#" + ctlSecTo).val();
			
			//put the 2 parameters in the clause
			var clause = fieldName + " between '" + fromDate + "' and '" + toDate + "' ";
			
			return {clean: true, isUsed: true, whereClausePiece: clause};
		}
	},
	
	date: {
		createControl: function(i, spanToAppendTo) {
			var html = '<div><label>From:</label><input type="text" id="fromDate' + i + '">';
			html+='<label>To:</label> <input type="text" id="toDate' + i + '">';
			spanToAppendTo.append(html);
			
			//run the function that turns them into a date control
			$('#fromDate' + i).datepicker();
			$('#toDate' + i).datepicker();
			//I'm defaulting the date so they don't accidentally run it for the entire table, b/c that could bog down the server.
			$('#fromDate' + i).datepicker("setDate", new Date());
			$('#toDate' + i).datepicker("setDate", new Date());
			spanToAppendTo.append('</div>');
		},
		
		constructWhereClause: function(i, fieldName) {
			var ctlNameFrom = 'fromDate' + i;
			var ctlNameTo = 'toDate' + i;
			var fromDate;
			var toDate;
			
			//If they chose one of these, ensure they chose the other too.
			var len1 = $("#" + ctlNameFrom).val().length;
			var len2 = $("#" + ctlNameTo).val().length;
			if ((len1 === 0 && len2 > 0 ) || (len1 > 0 && len2 === 0 )) {
				return {clean: false, errorMsg: "You must select both dates, not just one."};
			}
			//they aren't using the dates, so continue on.
			else if (len1 === 0 && len2 === 0) {
				return {clean: true, isUsed: false}
			}
			
			fromDate = $("#" + ctlNameFrom).val();
			toDate = $("#" + ctlNameTo).val();
			
			//put the 2 parameters in the clause
			var clause = fieldName + " between '" + fromDate + "' and '" + toDate + "' ";
			
			return {clean: true, isUsed: true, whereClausePiece: clause};
		}
	},
	
	time: {
		createControl: function(i, spanToAppendTo) {
			var html = '<div><label>From:</label>';
			html+='<select id="fromHour' + i + '">' + window.criteriaTypes.optionsZeroTo22 + window.criteriaTypes.option23 + '</select>';
			html+='<select id="fromMin' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59 + '</select>';
			
			html+='<label>To:</label>';
			html+='<select id="toHour' + i + '">' + window.criteriaTypes.optionsZeroTo22 + window.criteriaTypes.option23Selected + '</select>';
			html+='<select id="toMin' + i + '">' + window.criteriaTypes.optionsZeroTo58 + window.criteriaTypes.option59Selected + '</select>';
			html+='</div>';			
			
			spanToAppendTo.append(html);
		},
		constructWhereClause: function(i, fieldName) {
			var ctlHourFrom = 'fromHour' + i;
			var ctlMinFrom =  'fromMin' + i;
			var ctlHourTo = 'toHour' + i;
			var ctlMinTo = 'toMin' + i;
			var fromTime;
			var toTime;
			
			//I figured time is unique that I can always query it if it's defaulted to the entire time range.
			fromTime = $("#" + ctlHourFrom).val() + ':' + $("#" + ctlMinFrom).val();
			toTime = $("#" + ctlHourTo).val() + ':' + $("#" + ctlMinTo).val();
			
			//put the 2 parameters in the clause
			var clause = fieldName + " between '" + fromTime + "' and '" + toTime + "' ";
			
			return {clean: true, isUsed: true, whereClausePiece: clause};
		}
	},
	
	//Use types like this if you need the dropdown values to come from a database table.
	BUILTIN_APAGNCY: {
		sqlQuery: 'select abbr from apagncy',
		createControl: function(i, spanToAppendTo, results) {
			//get dropdown items for agency
			//With selectize, it starts out as a textbox, not a select, and you assign it an array.
			var ctlName = 'BUILTIN_APAGNCY' + i;
			var html='<div><label>Choose</label><input type="text" id="' + ctlName + '" /></div>';
			spanToAppendTo.append(html);

			var items = [];
			
			//the results var is passed back to this function after it is generated when the db is queried.
			results.forEach(
				function(rec) {  
					var singleItem = { myKey: rec.ABBR, myVal: rec.ABBR };			
					
					items.push(singleItem);					
			});
			
			//run the code that turns it into a selectize control.
			//good examples here: http://brianreavis.github.io/selectize.js/
			$("#" + ctlName)
				.selectize({
					plugins: ['remove_button'], 
					valueField: 'myKey', 
					labelField: 'myVal',
					searchField: ['myKey'], 
					options: items, 
					delimiter: '~~~'
			});
		},
		constructWhereClause: function(i, fieldName) {
			var ctlName = 'BUILTIN_APAGNCY' + i;
			
			var selectedItems = $("#" + ctlName).val();
			
			//did they select anything from the list?
			//The isEmpty function comes from lodash.
			if (_.isEmpty(selectedItems)) {
				//they aren't using the agency, so continue on.
				return {clean: true, isUsed: false};
			}
			
			//they selected agencies, so find out how many.
			selectedItems = selectedItems.split("~~~");
			//put quotes around each item
			selectedItems = selectedItems.map(function(item){ return "'" + item + "'"; });
			//turn it into a string separated by commas.
			selectedItems = selectedItems.join(',');
			
			var clause = fieldName + ' in (' + selectedItems + ') ';
			
			return {clean: true, isUsed: true, whereClausePiece: clause};
		}
	}	
};
