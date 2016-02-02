/* global angular*/

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory','yelpFactory','uiGmapGoogleMapApi', function($scope, usersFactory, yelpFactory, uiGmapGoogleMapApi){
    
    // gets current logged user
    $scope.getCurrentUser = function() {
	    return usersFactory.user ? usersFactory.user : null;
	};
    
    // will hold location from the search bar
    $scope.location = '';
   
   	// set google maps position based on user current location
    function setPosition(position) {
       $scope.map.center = {latitude:position.coords.latitude, longitude:position.coords.longitude};
       $scope.map.zoom = 15;
    }
    
    // inits google maps
    function initMap() {
		uiGmapGoogleMapApi.then(function(maps) {
			//getting a instance of the google maps sdk
			console.log('maps sdk loaded');
			$scope.googleMapsSDK = maps;
	    	$scope.geocoder = new $scope.googleMapsSDK.Geocoder();
		});       
	}
	
	// create markers based on bars location
    function createMarkers(location) {
		yelpFactory.getBars(location)
		    .then(
		        function(res){
		            if (res.data.state === 'success') {
		                console.log(res.data.bars);   
		            } else {
		                $scope.error = 'error getting data from yelp';
		            }
		        },
		        function(error) {
		            console.log(error);
		        }
		);
    }	
	
	// default maps settings
	$scope.map = { 
    	center : { latitude: 1, longitude: 1 },
    	zoom: 2,
    	events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                	console.log('Apply');
                	// getting a instance of the map loaded.
                    $scope.mapInstance = map;
                });
            }
        }
    };
    
	// if user shares his position set zoom to 15 and use his coordinates.
	if (navigator.geolocation) {
	   
	   initMap();
       navigator.geolocation.getCurrentPosition(setPosition);

	// else, set zoom to world and wait for him to provide location via form	
	} else {
       initMap();
    } 	

	// set map position based on user search
    $scope.setLocation =  function() {
    	$scope.geocoder.geocode({'address': $scope.location}, function(results, status) {
		    if (status === $scope.googleMapsSDK.GeocoderStatus.OK) {
		      	$scope.mapInstance.setCenter(results[0].geometry.location);
		      	$scope.mapInstance.setZoom(15);
		    } else {
		      alert('Geocode was not successful for the following reason: ' + status);
		    }    
	  	});	
    };
}]);