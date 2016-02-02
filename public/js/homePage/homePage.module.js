/* global angular */
angular.module('HomePageModule',['uiGmapgoogle-maps']).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAy7zlZ4-momt_WMqvO4glC7YyRC-TkTz8',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});