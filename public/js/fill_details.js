$(document).ready(function() {
	if(dest["timezone"].length != 0)
		$('#time_zone').append("Time Zone: &nbsp;" + dest["timezone"]);

	if(dest["population"].length != 0)
		$('#population').append("Population: &nbsp;" + dest["population"]);
	
	if(dest["population_density"].length != 0)
		$('#pop_density').append("Population Density: &nbsp;" + dest["population_density"]);

	if(dest["elevation"].length != 0)
		$('#elevation').append("Elevation: &nbsp;" + dest["elevation"]);

	if(dest["postal_code"].length != 0)
		$('#postal_code').append("Postal Code: &nbsp;" + dest["postal_code"]);
	
	if(dest["latitude"].length != 0)
		$('#dlatitude').append("Latitude: &nbsp;" + dest["latitude"]);

	if(dest["longitude"].length != 0)
		$('#dlongitude').append("Longitude: &nbsp;" + dest["longitude"]);
	
	if(dest["website"].length != 0)
		$('#website').append('<a id="website_link" href="' + dest["website"] + '">' + dest["website"] + '<br />');
	
	if(dest["flag_photo"].length != 0) {
		$('#flag').append('<iframe src="' + dest["flag_photo"] + '"width="100%" height="500" margin="0" padding="0" border="none" overflow="hidden" scrolling="no"></iframe>');
	}
	else if(dest["flag_photo"].length == 0) {
		var element = document.getElementById("wiki_images");
		element.parentNode.removeChild(element);
	}
	
	$('#Demographics').css('padding-bottom', '25px');
	$('#Demographics').css('background-color', 'blue');
});
