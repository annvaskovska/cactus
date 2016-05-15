(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'logger', '$http', 'apiUrl', '$scope', 'user'];
    /* @ngInject */

    function DashboardController($q, logger, $http, apiUrl, $scope, user) {
        var vm = this;
        vm.onlineStatus = true;
        vm.saveChanges = saveChanges;
        vm.deleteLecture = deleteLecture;

        if( localStorage.getItem('user')) {
            vm.user = localStorage.getItem('user');
        }
        vm.user = user;

        vm.gridsterOpts = {
            margins: [20, 20],
            rowHeight: 270,
            columns: 3,
            mobileBreakPoint: 750
        };
        vm.lecture = {};
        $scope.$on('UpdateSheet', function(event, args) {
            vm.lecture = args.lecture;
            vm.html = args.lecture.html;
        });

        function saveChanges() {
            var sendData = {
                html: vm.html
            }
            $http.post(apiUrl.host + vm.user.tocken + '/52/' + vm.lecture.id, sendData)
                .then(function () {
                    $http.get(apiUrl.host + vm.user.tocken +'/all')
                        .then(function (res) {
                            console.log(res);
                            user.subjects = res.data.subjects;
                        })
                })
        }

        function deleteLecture() {
            $http.delete(apiUrl.host + vm.user.tocken + '/52/' + vm.lecture.id)
                .then(function () {
                    $http.get(apiUrl.host + vm.user.tocken +'/all')
                        .then(function (res) {
                            console.log(res);
                            user.subjects = res.data.subjects;
                        })
                })
        }

        //activate();
        //
        //function activate() {
        //    var promises = [getSuites(), getRuns()];
        //
        //    return $q.all(promises).then(function() {
        //        logger.info('Activated Dashboard View');
        //        fillDate();
        //    });
        //}
        //
        //function getSuites() {
        //    return $http.get(apiUrl.host + apiUrl.suites).then(
        //        function (res) {
        //            suitesData = res.data;
        //        }
        //    );
        //}
        //
        //function getRuns() {
        //    return $http.get(apiUrl.host + apiUrl.runs).then(
        //        function (res) {
        //            runsData = res.data;
        //        }
        //    );
        //}
        //
        ////TODO: implement correct deleteItem function without $index
        //function deleteItem($index) {
        //    vm.items.splice($index, 1);
        //}
        //
        //function fillDate() {
        //    vm.items = [
        //        {
        //            size: {
        //                x: 1,
        //                y: 1
        //            },
        //            //position: [0, 0],
        //            board: 'project',
        //            label: 'CURRENT PROJECT',
        //            name: 'Super Project numero uno',
        //            description: 'Super Project numero uno description bla bla Super Project numero uno description ' +
        //            'bla bla  Super Project numero uno description bla bla Super Project numero uno description bla bla'
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 1
        //            },
        //            //position: [0, 2],
        //            board: 'curRun',
        //            label: 'CURRENT RUN',
        //            feed: [
        //                {
        //                    name: 'Run name1',
        //                    time: '2 days ago',
        //                    status: '10%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                }
        //            ]
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 3
        //            },
        //            //position: [0, 4],
        //            board: 'activity',
        //            label: 'LATEST ACTIVITY',
        //            feed: [
        //                {
        //                    name: 'Run name1',
        //                    time: '2 days ago',
        //                    status: '10%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                }
        //            ]
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 2
        //            },
        //            //position: [4, 0],
        //            board: 'stats',
        //            label: 'STATISTICS'
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 2
        //            },
        //            //position: [4, 0],
        //            board: 'stats_activity',
        //            label: 'ACTIVITY'
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 1
        //            },
        //            //position: [4, 2],
        //            board: 'defects',
        //            label: 'LATEST DEFECT UPDATES',
        //            feed: [
        //                {
        //                    name: 'Run name1',
        //                    time: '2 days ago',
        //                    status: '10%'
        //                },
        //                {
        //                    name: 'Run run',
        //                    time: '1 week ago',
        //                    status: '70%'
        //                }
        //            ]
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 1
        //            },
        //            //position: [0, 2],
        //            board: 'runs',
        //            label: 'LATEST RUN UPDATES',
        //            feed: [
        //                {
        //                    name: runsData[0].name,
        //                    time: '2 days ago',
        //                    status: '10%'
        //                },
        //                {
        //                    name: runsData[1].name,
        //                    time: '1 week ago',
        //                    status: '70%'
        //                }
        //            ]
        //        }, {
        //            size: {
        //                x: 1,
        //                y: 1
        //            },
        //            //position: [1, 0],
        //            board: 'tests',
        //            label: 'LATEST TEST UPDATES',
        //            feed: [
        //                {
        //                    name: suitesData[0].suiteName,
        //                    time: '2 days ago',
        //                    status: '10%'
        //                },
        //                {
        //                    name: suitesData[1].suiteName,
        //                    time: '1 week ago',
        //                    status: '70%'
        //                }
        //            ]
        //        }
        //    ];
        //}

    }
})();
