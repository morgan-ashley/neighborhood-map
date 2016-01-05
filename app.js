var infowindow, map, marker, myCenter;
var markers = [];

var initialLocations = [{
	"name": "Bar Crudo",
	"lat": 37.775949,
	"lng": -122.438190
}, {
	"name": "Monsieur Benjamin",
	"lat": 37.777504,
	"lng": -122.423334
}, {
	"name": "Nopa",
	"lat": 37.775188,
	"lng": -122.437461
}, {
	"name": "Absinthe Brasserie & Bar",
	"lat": 37.777076,
	"lng": -122.422854
}, {
	"name": "Nopalito",
	"lat": 37.773564,
	"lng": -122.438857
}, {
	"name": "Smuggler's Cove",
	"lat": 37.779432,
	"lng": -122.423352
}, {
	"name": "Chile Pies & Ice Cream",
	"lat": 37.776578,
	"lng": -122.441692
}, {
	"name": "Little Star Pizza",
	"lat": 37.777786,
	"lng": -122.438004
}, {
	"name": "Two Sisters Bar and Books",
	"lat": 37.776632,
	"lng": -122.425824
}, {
	"name": "The Mill",
	"lat": 37.776721,
	"lng": -122.437749
}, {
	"name": "4505 Burgers & BBQ",
	"lat": 37.776434,
	"lng": -122.438231
}]


myCenter = {lat: 37.776859, lng: -122.431403};
 
// Create a new Google Map object
map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    scrollwheel: false,
    zoom: 16,
    zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_BOTTOM
			}
  });

//iterate through JSON array and push all locations onto map
for(var i = 0; i < initialLocations.length; i ++) {
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(initialLocations[i].lat, initialLocations[i].lng),
		map: map,
		title: initialLocations[i].name
	}); //end of marker object

	markers.push(marker);
	
	marker.addListener('click', function() {
	infowindow.setContent(this.title);
    infowindow.open(map, this);
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ 
    	marker.setAnimation(null); }, 250);
  }); // end of marker listener
} // end of for-loop

infowindow = null;
infowindow = new google.maps.InfoWindow({
content: "holding..."
});

//Object Constructor
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.marker = ko.observable();
	this.rating = ko.observable();
	this.url = ko.observable();
}
//View Model
var viewModel = function() {
	var self = this;
	this.locationList = ko.observableArray([]);

	/* Creates new Place objects for each item in initalLocations */
	initialLocations.forEach(function(locItem) {
		self.locationList.push( new Place(locItem) );
	});

	self.locations = ko.observableArray(initialLocations);
	self.userInput= ko.observable('');
  	self.search = ko.computed(function(){
    	return ko.utils.arrayFilter(self.locations(), function(item){
      		return item.name.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
   		});
  	});	
}

ko.applyBindings(new viewModel);





	    

