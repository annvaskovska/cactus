(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'logger', '$http', 'apiUrl', '$scope', 'user', '$uibModal'];
    /* @ngInject */

    function DashboardController($q, logger, $http, apiUrl, $scope, user, $uibModal) {
        var vm = this;
        vm.addPicture = addPicture;
        vm.addSound = addSound;
        vm.onlineStatus = 1;
        vm.saveChanges = saveChanges;
        vm.deleteLecture = deleteLecture;
        vm.parentSubjectId =  null;
        vm.parentLectureId =  null;

        if( localStorage.getItem('user')) {
            vm.user = localStorage.getItem('user');
        }
        vm.user = user;

        vm.editingMode = false;

        vm.gridsterOpts = {
            margins: [20, 20],
            rowHeight: 270,
            columns: 3,
            mobileBreakPoint: 750
        };
        vm.lecture = {};
        $scope.$on('UpdateSheet', function(event, args) {
            vm.lecture = args.lecture;
            vm.parentLectureId = args.lecture.id;
            vm.parentSubjectId = args.subject.id;
            vm.html = args.lecture.html;
            vm.editingMode = true;
        });

        function saveChanges() {
            var sendData = {
                html: vm.html
            };

            if (vm.onlineStatus === 0) {
                var oldUser = JSON.parse(localStorage.getItem('user'));
                for (var i=0; i < oldUser.subjects.length; i++) {
                    console.log(oldUser.subjects[i].id == vm.parentSubjectId);
                    if (oldUser.subjects[i].id == vm.parentSubjectId) {
                        for (var j=0; j < oldUser.subjects[i].lectures.length; j++) {
                            console.log("j=" + j);
                            if (oldUser.subjects[i].lectures[j].id === vm.lecture.id) {
                                oldUser.subjects[i].lectures[j].html = vm.html;
                            }
                        }
                    }
                }
                localStorage.setItem('user', JSON.stringify(oldUser));
            } else {
                $http.post(apiUrl.host + vm.user.tocken + '/' + vm.parentSubjectId + '/' + vm.lecture.id, sendData)
                    .then(function () {
                        $http.get(apiUrl.host + vm.user.tocken + '/all')
                            .then(function (res) {
                                user.subjects = res.data.subjects;
                                localStorage.setItem('user', JSON.stringify(user));
                            })
                    })
            }
        }

        function deleteLecture() {
            $http.delete(apiUrl.host + vm.user.tocken + '/' + vm.parentSubjectId +  '/' + vm.lecture.id)
                .then(function () {
                    $http.get(apiUrl.host + vm.user.tocken +'/all')
                        .then(function (res) {
                            user.subjects = res.data.subjects;
                            localStorage.setItem('user', JSON.stringify(user) );
                        })
                })
        }

        function addPicture() {
            var modalCreateProject = $uibModal.open({
                    templateUrl: 'app/dashboard/add-picture.html',
                    controller: function ($uibModalInstance) {

                        var vmModal = this;
                        vmModal.color = '#00F';
                        vmModal.version = 30;
                        vmModal.undo =  function(){
                            vmModal.version--;
                        };
                        vmModal.dismiss = modalCreateProject.dismiss;
                    },
                    controllerAs: 'vmModal'
                }
            );
        }

        function addSound() {
            var modalCreateProject = $uibModal.open({
                    templateUrl: 'app/dashboard/add-sound.html',
                    size: 'lg',
                    controller: function ($uibModalInstance) {

                        var vmModal = this;

                        vmModal.dismiss = modalCreateProject.dismiss;
                    },
                    controllerAs: 'vmModal'
                }
            );
        }
    }
})();
