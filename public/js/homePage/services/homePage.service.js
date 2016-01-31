/* global angular */

angular.module('HomePageModule').factory('usersFactory',['$http', function($http){
    var usersFactory = {};

    // gets user passed to the window object by the server
    usersFactory.user = window.user;
    
    return usersFactory;
    
}]);