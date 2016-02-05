/* global angular */

angular.module('HomePageModule').factory('usersFactory',['$http', function($http){
    var usersFactory = {};

    // gets user passed to the window object by the server
    usersFactory.user = window.user;
    
    return usersFactory;
    
}]);


angular.module('HomePageModule').factory('yelpFactory',['$http', function($http){
    var yelpFactory = {};

    // gets user passed to the window object by the server
    yelpFactory.getBars = function(location) {
        return $http.get('/yelp/'+location);
    };
    
    yelpFactory.going = function(barId, user) {
        return $http.put('/yelp/'+barId+'/'+ user);
    };
    
    yelpFactory.notGoing = function(barId, user) {
        return $http.delete('/yelp/'+barId+'/'+ user);
    };
    
    return yelpFactory;
}]);