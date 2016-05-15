(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['logger', '$state', '$scope', 'user', '$http', '$rootScope'];
    /* @ngInject */
    function LandingController(logger, $state, $scope, user, $http, $rootScope) {
        var vmLanding = this;
        vmLanding.nickname = "";
        vmLanding.password = "";
        vmLanding.passwordConfirm = "";
        vmLanding.logIn = logIn;
        vmLanding.user = user;

        function logIn() {
            console.log('logIN')
            $http.get('http://localhost:8080/api/getLogin?login=max&pass=pass')
                .then(function (res) {
                    user.tocken = res.data.token;
                    localStorage.setItem('token', res.data.token);
                    $http.get('http://localhost:8080/api/82fe7916-eecc-4e79-9731-0a87d75eb3e0/all')
                        .then(function (res) {
                            user.subjects = res.data.subjects;
                        }).then(function () {
                            user.authorized = true;
                            localStorage.setItem('authorized', true);
                        });
                }
            )

        }
    }
})();
