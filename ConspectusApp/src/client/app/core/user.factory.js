(function() {
    'use strict';

    angular.module('app.core')
        .factory('user', userFactory);

    userFactory.$inject = ['$rootScope', '$http', '$q'];

    function userFactory($rootScope, $http, $q) {
        var service = {};
        if(localStorage.getItem('token')) {
            $http.get('http://localhost:8080/api/82fe7916-eecc-4e79-9731-0a87d75eb3e0/all')
                .then(function (res) {
                    service.subjects = res.data.subjects;
                    localStorage.setItem('user', JSON.stringify(service) );
                })
        } else {
            service = {
                authorized: localStorage.getItem('authorized'),
                authorize: authorize,
                deauthorize: deauthorize
            };
        }
        getMe();

        function getMe() {
            $http.get('/api/v1/User').success(function(data) {

            });
        }

        $rootScope.$on('UserDeauthorized', function() {
            service.authorized = false;
        });

        function authorize() {
        //
        }

        function deauthorize() {
            //
        }

        return service;

    }
})();
