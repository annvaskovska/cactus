(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['logger', '$state', '$scope', 'user', '$http', '$rootScope'];
    /* @ngInject */
    function LandingController(logger, $state, $scope, user, $http, $rootScope) {
        var vmLanding = this;
        vmLanding.newUser = {};
        vmLanding.nickname = "";
        vmLanding.password = "";
        vmLanding.passwordConfirm = "";
        vmLanding.logIn = logIn;
        vmLanding.register = register;
        vmLanding.user = user;

        function logIn() {
            console.log('logIN')
            $http.get('http://localhost:8080/api/getLogin?login=ann&pass=123')
                .then(function (res) {
                    user.tocken = res.data.token;
                    localStorage.setItem('token', res.data.token);
                    $http.get('http://localhost:8080/api/6768c88f-0199-4679-8d62-f1543ff2d073/all')
                        .then(function (res) {
                            user.subjects = res.data.subjects;
                        }).then(function () {
                            user.authorized = true;
                            localStorage.setItem('user', JSON.stringify(user));
                            localStorage.setItem('authorized', true);
                        });
                }
            )
        }

        function register() {
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/registerUser',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        }
    }
})();
