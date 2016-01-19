var infowindow, map, marker;

var initialLocations = [{
  "name": "Nopa",
  "latLng": {lat: 37.775188, lng: -122.437461},
},  
{
  "name": "Bar Crudo",
  "latLng": {lat: 37.775710796220146, lng: -122.438067580171},
},
{
  "name": "Barrel Head Brewhouse",
  "latLng": {lat: 37.775676, lng: -122.446110},
},
{
	"name": "Chile Pies & Ice Cream",
	"latLng": {lat: 37.776578, lng: -122.441692},
}, 
{  
	"name": "Little Star Pizza",
	"latLng": {lat: 37.777539, lng: -122.438015},
},
{
  "name": "Bistro Central Parc",
  "latLng": {lat:  37.775013, lng: -122.444338},
},  
{
	"name": "The Mill",
	"latLng": {lat: 37.776469, lng: -122.437792}, 
}, 
{
  "name": "Nopalito",
  "latLng": {lat: 37.773564, lng: -122.438857},
}, 
{
	"name": "4505 Burgers & BBQ",
	"latLng": {lat: 37.776207, lng: -122.438252},
}];

function Place(data) {
    this.name = data.name;
    this.latLng = data.latLng;  
    this.marker = ko.observable(data.marker);
}

var ViewModel = function() {
  var self = this;
  
/* Styles for Google Map */  
  var styles = [
    {
      "featureType": "landscape",
      "stylers": [
        {"hue": "#00FF8A"},
        {"saturation": -27.272727272727266},
        {"lightness": -16.39215686274511},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#FF0D00"},
        {"saturation": 100},
        {"lightness": -12.721568627450978},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {"hue": "#FFD000"},
        {"saturation": 100},
        {"lightness": 19.84313725490196},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 148},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {"hue": "#00FF23"},
        {"saturation": -25.806451612903203},
        {"lightness": 3.3725490196078454},
        {"gamma": 1}
      ]
    }
  ];

  /* Links list view to marker when user clicks on the list element */
  self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker, 'click');
  };

  /* Create a new Google Map object */
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.775732, lng: -122.441672},
    zoom: 16,
    styles: styles,    
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
     }
  });

  var contentString;
  /* Declare Google map info window */
  self.infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  /* Creates new Place objects for each item in initalLocations array */
  self.allLocations = [];
  initialLocations.forEach(function(place) {
    self.allLocations.push(new Place(place));
  });
  
  /* Build Google Map markers and place them onto the map */
  self.allLocations.forEach(function(place) {
    
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
   
    place.marker = new google.maps.Marker(markerOptions);

     /* Foursquare API */
      var clientID = "AWOF0E4HV3H1H3BFIGE2KGZA5F2PMKF2UEU3ZL0QFZTEJPTP";
      var clientSecret = "NLOWB4Z4KOE1KVJNZ5PXIZHUVS04RSQWJ5GTLDHLZO0QMMUE";
      var foursquareURL = 'https://api.foursquare.com/v2/venues/search?limit=1&ll=' + place.latLng.lat + ',' + place.latLng.lng + '&client_id=' + clientID + '&client_secret='+ clientSecret + '&v=20140806';
      var results, name, url, street, city;
     
      $.getJSON(foursquareURL, function(data){
        console.log('AJAX is working!');
        results = data.response.venues[0],
        place.name = results.name,
        place.url= results.hasOwnProperty('url') ? results.url : '';
        place.street = results.location.formattedAddress[0],
        place.city = results.location.formattedAddress[1]
  
    /* error response */
    }).fail(function() { alert("Woopsie Daisy! Looks like something went wrong!");})
    
    /* Add click listener to marker and open info window */
    place.marker.addListener('click', function(){

      /* Set timeout animation */
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ place.marker.setAnimation(null); }, 1400);

      
      contentString = '<h4>' + place.name + '</h4>\n<p>' + place.street + '</p>\n<p>' + place.city + '</p><a href= ' + place.url + '>' + place.url + '</a>';   
      /* Open info window and set its content */
      self.infowindow.setContent(contentString);
      self.infowindow.open(self.googleMap, place.marker);

    })
  });

  /* A observable array that will filter our list-view and markers */
  self.visibleLocations = ko.observableArray();
  
  /* Making sure all locations are visible before user input */
  self.allLocations.forEach(function(place) {
    self.visibleLocations.push(place);
  });
  
  /* Keeps track of our users input and is bound to 'textInput: userInput' in index.html*/
  self.userInput = ko.observable('');

  // filterMarkers looks at the userInput to see if it matches any characters in our locaions and markers.
  // If a string is found with a match, it is still visible while all other markers are removed 
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    self.visibleLocations.removeAll();
    
   self.allLocations.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.visibleLocations.push(place);
      }
    });
    self.visibleLocations().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };
}
function myMap() { 
ko.applyBindings(new ViewModel());
}

