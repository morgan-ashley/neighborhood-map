var infowindow, map, marker;

var initialLocations = [{
	"id": "44e37004f964a52042371fe3",
	"name": "Bar Crudo",
	"latLng": {lat: 37.775685, lng: -122.438223},
  "marker": null
}, 
{
	"id": "53b4dd52498eef48c82d89a5",
	"name": "Monsieur Benjamin",
	"latLng": {lat: 37.777504, lng: -122.423334},
  "marker": null
}, 
{
	"id": "44646408f964a52026331fe3",
	"name": "Nopa",
	"latLng": {lat: 37.775188, lng: -122.437461},
  "marker": null
}, 
{
	"id": "43dc103ef964a520992e1fe3",
	"name": "Absinthe Brasserie & Bar",
	"latLng": {lat: 37.777035, lng: -122.422923},
  "marker": null  
}, 
{
	"id": "49be8fe0f964a520b9541fe3",
	"name": "Nopalito",
	"latLng": {lat: 37.773564, lng: -122.438857},
  "marker": null
}, 
{
	"id": "4afe6db4f964a520682f22e3",
	"name": "Smuggler's Cove",
	"latLng": {lat: 37.779432, lng: -122.423352},
  "marker": null
}, 
{
	"id": "4baae1f9f964a520f18b3ae3",
	"name": "Chile Pies & Ice Cream",
	"latLng": {lat: 37.776578, lng: -122.441692},
  "marker": null
}, 
{
	"id": "433dd180f964a52048281fe3",  
	"name": "Little Star Pizza",
	"latLng": {lat: 37.777539, lng: -122.438015},
  "marker": null
}, 
{
	"id": "4e937514f9f44dd023514f2b",
	"name": "Two Sisters Bar and Books",
	"latLng": {lat: 37.776363, lng: -122.425833}, 
  "marker": null
}, 
{
	"id": "4feddd79d86cd6f22dc171a9",
	"name": "The Mill",
	"latLng": {lat: 37.776469, lng: -122.437792}, 
  "marker": null
}, 
{
	"id": "53644323498e8964add3b940",
	"name": "4505 Burgers & BBQ",
	"latLng": {lat: 37.776207, lng: -122.438252}, 
  "marker": null
}]

function Place(data) {
    this.name = data.name;
    this.latLng = data.latLng;  
    this.id= data.id;
    this.marker = ko.observable(data.marker);
   // this.street = ko.observable();
   // this.city = ko.observable();
  }

var ViewModel = function() {
  var self = this;

  /* Links list view to marker when user clicks on the list element */
  self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker, 'click');
      };
  
  /* Create a new Google Map object */
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.776859, lng: -122.431403},
    zoom: 16,    
    zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
    });
  var contentSring = '<h4>' + this.name + '<h4>';
  /* Declare Google map info window */
  self.infowindow = new google.maps.InfoWindow({});

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
    
    /* Add click listener to marker and open info window */
    place.marker.addListener('click', function(){

    /* Set timeout animation */
    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ place.marker.setAnimation(null); }, 1400);

    /* Foursquare API */
    var clientID = "AWOF0E4HV3H1H3BFIGE2KGZA5F2PMKF2UEU3ZL0QFZTEJPTP";
    var clientSecret = "NLOWB4Z4KOE1KVJNZ5PXIZHUVS04RSQWJ5GTLDHLZO0QMMUE";
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?limit=1&ll=' + place.latLng.lat + ',' + place.latLng.lng + '&client_id=' + clientID + '&client_secret='+ clientSecret + '&v=20140806';
    var results, name, url, street, city;
    $.getJSON(foursquareURL, function(data){
      results = data.response.venues,
      place.name = results.name,
      place.url = results.url,
      place.street = results.location.formattedAddress[0],
      place.city = results.location.formattedAddress[1]
       // place.formattedPhone = results.contact.formattedPhone 

    /* error response */
    }).error(function(e){
      //$('p').text('Woopsie Daisy! Looks like something went wrong!');
    });
        
    /* Open info window and set its content */
    self.infowindow.setContent('<h4>' + place.name + '</h4>\n<a href=' + place.url + '>' + place.url + '</a>\n<p><b>Address:</b></p>\n<p>' + place.street + '</p>\n<p>' + place.city + '</p>');
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

ko.applyBindings(new ViewModel());
