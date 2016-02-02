/* global angular*/

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory','yelpFactory','uiGmapGoogleMapApi', function($scope, usersFactory, yelpFactory, uiGmapGoogleMapApi){
    
    // gets current logged user
    $scope.getCurrentUser = function() {
	    return usersFactory.user ? usersFactory.user : null;
	};
	
    // will hold location from the search bar
    $scope.location = '';
    
    // will hold bar results
   	$scope.barMarkers = [];
   
   	// set google maps position based on user current location
    function setPosition(position) {
       $scope.map.center = {latitude:position.coords.latitude, longitude:position.coords.longitude};
       $scope.map.zoom = 12;
       // will set markers based on current location, just if the geocoder is available.
       if ($scope.geocoder)  {
	       $scope.geocoder.geocode(
	       		{ 
	       		  'location': { 
	       		  		lat:position.coords.latitude, 
	       		  		lng: position.coords.longitude
	       		  }
	       			
	       		}, function (results, status) {
			    	if (status === $scope.googleMapsSDK.GeocoderStatus.OK) {
			      		createMarkers(results[0].formatted_address);
			    	} else {
			      		alert('Geocode was not successful for the following reason: ' + status);
			    	}    
		  });
     	}
    }
    
	// default maps settings
	$scope.map = { 
    	center : { latitude: 1, longitude: 1 },
    	zoom: 2,
        options: {},    	
    	events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                	console.log('Apply');
                	// getting a instance of the map loaded.
                    $scope.mapInstance = map;
                    
                    // setting controls positions after the SDK is loaded
                    var position = {
		    				position: $scope.googleMapsSDK.ControlPosition.LEFT_BOTTOM
		    		};
                    $scope.mapInstance.setOptions({
		    			zoomControlOptions : position,
		    			panControlOptions: position,
		    			streetViewControlOptions : position,
		    			overviewMapControlOptions : position,
		    			mapTypeControlOptions: position
					});
                });
            }
        }
    };
        
    
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
		                $scope.barMarkers = res.data.bars.businesses;
		                
		                // setting markers info windows
		                $scope.barMarkers.forEach(function(marker){
		                	marker.windowOptions = { 
		                		visible: false,
		                		maxWidth: 250
		                	};
		                	marker.animationOptions = {
		                		animation: $scope.googleMapsSDK.Animation.DROP
		                		
		                	};
		                	marker.closeInfoWindow = function() {marker.windowOptions.visible = false;};
		                	marker.openInfoWindow = function() {marker.windowOptions.visible = !marker.windowOptions.visible;};
		                });
		                
		            } else {
		                $scope.error = 'error getting data from yelp';
		            }
		        },
		        function(error) {
		            console.log(error);
		        }
		);
    }
	
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
		      	$scope.mapInstance.setZoom(12);
		      	createMarkers($scope.location);
		    } else {
		      alert('Geocode was not successful for the following reason: ' + status);
		    }    
	  	});	
    };
}]);