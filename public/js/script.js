$(document).ready( function(){
	var dest = {};
	var origin = {};

	// dest["currency"] = "eur";
	// dest["name"] = "Germany";
	// dest["capital"] = "berlin";

	// origin["currency"] = "usd";
	// origin["name"] = "USA";
	// origin["capital"] = "washington dc";


	document.getElementById("destination").innerHTML = origin["name"] + " &nbsp; &nbsp;  ✈  &nbsp; &nbsp; " + dest["name"];
	var toCurrency = dest.currency;
	var fromCurrency = origin.currency;
	$.ajax({
		url: "http://devel.farebookings.com/api/curconversor/"+from+"/"+to+"/1/",
		dataType: 'jsonp',
		success: function (data) {
			document.getElementById("currency").innerHTML = document.getElementById("currency").innerHTML + "<br /> 1 " + from + " = " + data[to] + " " + to;
		}		
	});
	$('#currency').css("background-color", "yellow"); //another way 
})