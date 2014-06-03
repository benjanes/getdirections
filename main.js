$(document).ready(function() {
	$('#address').focus();
	var home = {
		lat:41.185868,
		lng:-73.621420
	};
	var map = new GMaps({
	  div: '#map',
	  lat: home.lat,
	  lng: home.lng,
	  width: '350px',
	  height: '350px',
	  zoom: 15,
	  streetViewControl: false,
	  panControl: false,
	  overviewMapControl: false
	}); // end definition of new GMaps object
	map.addMarker({
    lat: home.lat,
    lng: home.lng,
    title: 'Mianus River Gorge'
	}); // end add Marker
	var input = document.getElementById('address');
	var options = {
		componentRestrictions: {country: 'us'}
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);
	$('#getdirections').submit(function(c){
		c.preventDefault();
		
		GMaps.geocode({
			address: $('#address').val().trim(),
			callback: function(results, status){
				if(status=='OK'){
					$('#instructions').html('<tr id="toprow"><td>Directions</td><td>Distance</td></tr>');
					map.removeMarkers();
					map.removePolylines();
					var latlng = results[0].geometry.location;
					var latitude = latlng.lat();
					var longitude = latlng.lng();
					var distance = 0;
					var time = 0;
					map.addMarkers([{
						lat: latitude,
						lng: longitude
					},
					{
						lat: home.lat,
						lng: home.lng
					}]); // end add Marker function
					map.fitZoom();
					map.travelRoute({
						origin: [latitude, longitude],
						destination: [home.lat, home.lng],
						travelMode: 'driving',
						unitSystem: 'imperial',
						step: function(e){
							$('#instructions').append('<tr class="maintable"><td>' + e.instructions + '</td><td> '+ e.distance.text + '</td></tr>');
							map.drawPolyline({
								path: e.path,
								strokeColor: '#131540',
								strokeOpacity: 0.6,
								strokeWeight: 6
							}); //end drawPolyline
							distance += e.distance.value;
							time += e.duration.value;							
						}, // end step function
						end: function(){
							var miles = Math.round(distance*.00621371)/10;
							$('#instructions').append('<tr><td class="totals">Total Distance: </td><td>' + miles + ' miles</td></tr>');
							var hours = Math.floor(time/3600);
							var minutes = Math.round((time-(hours*3600))/60);
							if (hours == 0) {
						  	$('#instructions').append('<tr><td class="totals">Estimated Travel Time: </td><td>' + minutes + ' minutes</td></tr>');	
							} else {
						  	$('#instructions').append('<tr><td class="totals">Estimated Travel Time: </td><td>' + hours + ' hours, ' + minutes + ' minutes</td></tr>');
							}
						}
					}); // end travel route function																					
				} // end if statement
			} // end callback function definition
		}); // end geocode function
	}); // end submit
}); // end ready