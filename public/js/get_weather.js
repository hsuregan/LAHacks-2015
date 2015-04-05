$(document).ready(
	function() {
		get_high_low(dest["city"], dest["country"]);
	}
);


function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp*1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	return date;
}


function b(latitude, longitude){
    var apiKey = '706c386921e262c76e7f8801b02e8c85';
    var url = 'https://api.forecast.io/forecast/';
    var lati = latitude;
    var longi = longitude;
    var x = [];
    $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
    	var high = [];
  		var low = [];
    	for(i = 0; i < 6; i++) {
    		x.push(data.daily.data[i].icon);
    		high.push(data.daily.data[i].temperatureMax);
    		low.push(data.daily.data[i].temperatureMin)
    	}
		console.log(x);
		get_next_7_day_forcast(x, high, low);
    });
    return x;
}
function get_high_low(city, country) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=+" + city + ",+" + country + "&key=AIzaSyBT6-6KYw_7sfruJivjSAMfVH699u-8ql8";
	console.log("url is " + url);
	var icons;
	$.getJSON(url, function (json) {
		var latitude = json.results[0].geometry.location.lat;
		var longitude = json.results[0].geometry.location.lng;
		console.log('Latitude : ', latitude);
		console.log('Longitude : ', longitude);
		icons = b(latitude, longitude);
		console.log(icons);
	});
	return icons;
}

function get_next_7_day_forcast(arr, high, low) {
	console.log(high);
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var skycons = new Skycons({"color": "white"});

	for(i = 0; i < arr.length; i ++) {
		day = day + i;
		var num = i + 1;
		var icon = "icon" + num;

		switch(arr[i]) {
			case "clear-day":
				skycons.add(icon, Skycons.CLEAR_DAY);
				document.getElementById("weather_date" + num).innerHTML = "<center>" + month + "/" + day + ": clear <br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
			case "partly-cloudy-day":
				skycons.add(icon, Skycons.PARTLY_CLOUDY_DAY);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": partly cloudy<br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
			case "partly-cloudy-night":
				skycons.add(icon, Skycons.PARTLY_CLOUDY_NIGHT);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": partly cloudy night<br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
			case "cloudy":
				skycons.add(icon, Skycons.CLOUDY);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": cloudy<br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
			case "rain":
				skycons.add(icon, Skycons.RAIN);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": rainy<br />H: " + high[i] +  "F<br />L: " + low[i] + "F</center>";
				break;
			case "sleet":
				skycons.add(icon, Skycons.SLEET);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": sleet<br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
			case "snow":
				skycons.add(icon, Skycons.SNOW);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": snowy<br />H: " + high[i] +"F<br />L: " + low[i] +  "F</center>";
				break;
			case "wind":
				skycons.add(icon, Skycons.WIND);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": windy<br />H: " + high[i] +"F<br />L: " + low[i] +   "F</center>";
				break;
			case "fog":
				skycons.add(icon, Skycons.FOG);
				document.getElementById("weather_date" + num).innerHTML ="<center>" + month + "/" + day + ": fog<br />H: " + high[i] + "F<br />L: " + low[i] +  "F</center>";
				break;
		}
	};
	skycons.play();
}



 