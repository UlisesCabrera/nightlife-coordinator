/* global angular */

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory','yelpFactory', function($scope, usersFactory, yelpFactory){
    $scope.location = '';
    $scope.bars = [];
    
    $scope.getCurrentUser = function() {
	    return usersFactory.user ? usersFactory.user : null;
	};
	
	$scope.search = function() {
	    yelpFactory.getBars($scope.location)
	        .then(
	            function(res){
	                if (res.data.state === 'success') {
	                    console.log(res.data.bars);   
	                    $scope.location = '';
	                    $scope.bars = res.data.bars.businesses;
	                } else {
	                    $scope.error = 'error getting data from yelp';
	                }
	            },
	            function(error) {
	                console.log(error);
	            }
	        );
	};
	 
}]);