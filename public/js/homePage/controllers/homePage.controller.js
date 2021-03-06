/* global angular*/

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory','yelpFactory','uiGmapGoogleMapApi','uiGmapIsReady', 
    function($scope, usersFactory, yelpFactory, uiGmapGoogleMapApi,uiGmapIsReady){
	
	//checks if the user is going to a bar, to enable the 'Not going' button
	$scope.userGoing = function(bar, user) {
		if (bar) {
			if (bar.whoIsGoing.indexOf(user) === -1) {
				return false;
			} else { 
				return true;
			}
		}
	};
	
	$scope.notGoing = function(bar, user) {
		var index =  bar.whoIsGoing.indexOf(user);
		bar.whoIsGoing.splice(index, 1);	
		yelpFactory.notGoing(bar.id, user)
			.then(function(res){
				if (res.data.state === 'failure') {
					bar.whoIsGoing.push(user);
					alert('Problem removing yourself from going');
				}
			});
	};
	
	// going function, sends user and bar id to database and push user to client array
    $scope.iAmGoing = function iAmGoing(bar, user) {
    	bar.whoIsGoing.push(user);
    	yelpFactory.going(bar.id, user)
    		.then(function(res){
    			if (res.data.state === 'failure') { 
					var index =  bar.whoIsGoing.indexOf(user);
					bar.whoIsGoing.splice(index, 1);
					alert('Problem adding yourself to the bar list');
    		}
    	});
    };	
	
	
	// will toggle the list visibility
	$scope.toggleList = function() {
		$('.barList').toggle(500);
		$('.barList-show').toggle(500);
	};
	
	// makes sure to load the map after the googleMapsSDK is ready.
	uiGmapGoogleMapApi.then(function(maps) {
		console.log('maps sdk loaded');
		$scope.googleMapsSDK = maps;
    	$scope.geocoder = new $scope.googleMapsSDK.Geocoder();
	});
	
	 /**
	 * Check if the user has a location saved on session storage if not, 
	 * if it shared his location to set inital map center with those.
	 */

	function initialLocation() { 
	    if (sessionStorage.getItem("location")) {
			  $scope.location = sessionStorage.getItem("location");
			  $scope.setLocation();
		} else {
			if (navigator.geolocation) {
		       navigator.geolocation.getCurrentPosition($scope.setLocation);
			} 	
		} 
	}
	// sets current location based on geoposition.
	$scope.setCurrentLocation =  function() {
		$scope.location = '';
		if (navigator.geolocation) {
	       navigator.geolocation.getCurrentPosition($scope.setLocation);
		} 			
	};
	
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
		                $scope.barMarkers = res.data.bars;
		                
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
		                	
		                	marker.openInfoWindow = function(bar) {
		                		// opens info window only on tablets and desktops
		                		if ($(window).width() > 767) {
		                			marker.windowOptions.visible = !marker.windowOptions.visible;
		                		} else {
		                		// opens modal on mobile devices, get bar clicked as parameter and uses it as scope.	
		               				$scope.bar = bar;
									$('#barModal').modal();
		                		}
		                	};
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
			
			initialLocation();
		
        });
    });
}]);