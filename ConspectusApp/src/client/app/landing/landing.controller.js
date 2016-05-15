(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['logger', '$state','$scope', 'user'];
    /* @ngInject */
    function LandingController(logger, $state, $scope, user) {
        var vmLanding = this;
        vmLanding.nickname = "";
        vmLanding.password = "";
        vmLanding.passwordConfirm = "";
        vmLanding.logIn = logIn;
        vmLanding.user = user;

        function logIn() {
            user.authorize();
            if (user.authorized) {
                $state.go('dashboard');
            }
        }
    }
})();
