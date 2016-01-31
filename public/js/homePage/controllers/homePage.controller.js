/* global angular */

angular.module('HomePageModule')
    .controller('HomePageController',['$scope', 'usersFactory', function($scope, usersFactory){
    
    $scope.getCurrentUser = function() {
	    return usersFactory.user ? usersFactory.user : null;
	 };
	 
}]);