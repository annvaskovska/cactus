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
                title: ""
            };
            vm.sublect = {
                title: ""
            }

            $rootScope.$on('UpdateSheet', function(event, args) {
                console.log(args.lecture);
                vm.lecture = args.lecture;
                vm.subject = args.subject;
                vm.lecture = setCreateAndUpdateFields(vm.lecture);
            });

            function setCreateAndUpdateFields(lecture) {
                var createDate = new Date(lecture.createDate);
                var updateDate = new Date(lecture.createDate);

                var createString = 'Створено: ' +createDate.getDate() + ' ' + setMonth(createDate.getDate()) + ' ' + createDate.getFullYear() + ' o ' + createDate.getHours() + ':' + createDate.getMinutes();
                var updateString = 'Редаговано: ' + updateDate.getDate() + ' ' + setMonth(updateDate.getDate()) + ' ' + updateDate.getFullYear() + ' o ' + updateDate.getHours() + ':' + updateDate.getMinutes();

                lecture.created = createString;
                lecture.updated = updateString;

                return lecture;
            }

            function isCurrent(route) {
                if (!$state.current || !$state.current.title) {
                    return '';
                }
                var menuName = route;
                return $state.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
            }

            function logOut() {
                $state.go('landing.home');
            }

            function setMonth(n) {
                switch(n) {
                    case 0: return 'січня';
                    case 1: return 'лютого';
                    case 2: return 'березня';
                    case 3: return 'квітня';
                    case 4: return 'травня';
                    case 5: return 'червня';
                    case 6: return 'липня';
                    case 7: return 'серпня';
                    case 8: return 'вересня';
                    case 9: return 'жовтня';
                    case 10: return 'листопада';
                    case 11: return 'грудня';

                    default:
                    return 'травня';
                }
            }

        }

        return directive;
    }
})();
