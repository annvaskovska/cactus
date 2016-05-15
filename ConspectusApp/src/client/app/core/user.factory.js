(function() {
    'use strict';

    angular.module('app.core')
        .factory('user', userFactory);

    userFactory.$inject = ['$rootScope', '$http', '$q'];

    function userFactory($rootScope, $http, $q) {
        var service = {
            authorized: false,
            authorize: authorize,
            deauthorize: deauthorize
        };

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

        //function changeCurrentProject(id) {
        //    $http.put('/api/v1/Users/' + service.id, {currentProjectID: id}).success(function() {
        //        service.currentProjectID = id;
        //        getMe();
        //    });
        //}

        return service;

    }
})();
