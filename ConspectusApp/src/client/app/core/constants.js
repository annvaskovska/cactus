/* global Trello:false, moment:false, faker:false */
(function() {
    //'use strict';

    //if (typeof Trello == 'undefined') Trello = {authorized: function() {return true;}}; // jshint ignore:line

    angular
        .module('app.core')
        .constant('moment', moment)
        .constant('textAngular', textAngular)
        //.constant('Trello', Trello) // KEEP AN EYE! Trello is exposed by client.js from index file
        .constant('apiUrl', apiUrl())
        .constant('d3', typeof(d3) === 'undefined' ? 'd3mocked' : d3); // jshint ignore:line

    function apiUrl() {
        return {
            host: 'http://localhost:8080/api/'
        };
    }
})();
