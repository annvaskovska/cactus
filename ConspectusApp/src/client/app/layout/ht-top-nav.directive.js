(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);

    /* @ngInject */
    function htTopNav () {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vmNav',
            restrict: 'EA',
            replace: true,
            scope: {
                'navline': '=',
                'sidebar': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        TopNavController.$inject = ['$rootScope', '$state', 'user'];

        /* @ngInject */
        function TopNavController($rootScope, $state, user) {
            var vm = this;
            vm.isCurrent = isCurrent;
            vm.user = user;
            vm.logOut = logOut;
            vm.lecture = {
                title: "Choose lection from list :)"
            };

            $rootScope.$on('UpdateSheet', function(event, args) {
                console.log(args.lecture);
                vm.lecture = args.lecture;
            });

            function isCurrent(route) {
                if (!$state.current || !$state.current.title) {
                    return '';
                }
                var menuName = route;
                return $state.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
            }

            function logOut() {
                user.deauthorize();
                $state.go('landing.home');
            }

        }

        return directive;
    }
})();
