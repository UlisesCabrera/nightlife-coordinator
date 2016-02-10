/* global angular */
angular.module('HomePageModule',['uiGmapgoogle-maps'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: window.googleMapKey,
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});