/* global angular*/

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory','yelpFactory','uiGmapGoogleMapApi','uiGmapIsReady', function($scope, usersFactory, yelpFactory, uiGmapGoogleMapApi,uiGmapIsReady){
	
	// makes sure to load the map after the googleMapsSDK is ready.
	uiGmapGoogleMapApi.then(function(maps) {
		console.log('maps sdk loaded');
		$scope.googleMapsSDK = maps;
    	$scope.geocoder = new $scope.googleMapsSDK.Geocoder();
	});          
    
    
    // gets current logged user
    $scope.getCurrentUser = function() {
	    return usersFactory.user ? usersFactory.user : null;
	};
	
    // will hold location from the search bar
    $scope.location = '';
    
    // will hold bar results
   	$scope.barMarkers = [];
	
	// default maps settings
	$scope.map = { 
    	center : { latitude: 1, longitude: 1 },
    	zoom: 2
    };   
  
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
    
    
	// set map position based on user search or user current location
    $scope.setLocation =  function(position) {
    	// if search location is available, use it as first option.
    	if ($scope.location) {
	    	$scope.geocoder.geocode({'address': $scope.location}, function(results, status) {
			    if (status === $scope.googleMapsSDK.GeocoderStatus.OK) {
			      	$scope.mapInstance.setCenter(results[0].geometry.location);
			      	$scope.mapInstance.setZoom(12);
			      	createMarkers($scope.location);
			      	
			      	// save location on session storage
					sessionStorage.setItem('location', $scope.location);
			    } else {
			      alert('Geocode was not successful for the following reason: ' + status);
			    }    
		  	});
    	} else {
	       // if search location is not available, use the current location as second option
		   $scope.mapInstance.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});
		   $scope.mapInstance.setZoom(12);
		   
		   // reverse geocode location in order to used the human readable address with the yelp api
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
	  			}
	  		);
 		}    		
	};
    
    // perform these operations only after the map is ready.
    uiGmapIsReady.promise(1).then(function(instances) {
       instances.forEach(function(inst) {
            $scope.mapInstance = inst.map;
            // setting controls positions after the map is loaded
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
			
			
			/**
			 * Check if the user has a location saved on session storage if not, 
			 * if it shared his location to set inital map center with those.
			 */
			if (sessionStorage.getItem("location")) {
				  $scope.location = sessionStorage.getItem("location");
				  $scope.setLocation();
			} else {
				if (navigator.geolocation) {
			       navigator.geolocation.getCurrentPosition($scope.setLocation);
				} 	
			}  			
        });
    });
}]);