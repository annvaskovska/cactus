(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('htSidebar', htSidebar);

    /* @ngInject */
    function htSidebar() {
        var directive = {
            bindToController: true,
            controller: SidebarController,
            controllerAs: 'vmSidebar',
            restrict: 'EA',
            replace: true,
            scope: {
                'sidebar': '='
            },
            templateUrl: 'app/layout/sidebar.html'
        };

        SidebarController.$inject = ['$uibModal', 'logger', 'sidebarFactory',
            'user', '$state', '$rootScope', '$scope', '$http', 'apiUrl'];

        /* @ngInject */

        function SidebarController($uibModal, logger, sidebarFactory, user, $state, $rootScope, $scope, $http, apiUrl) {

            var vm = this;
            vm.user = user;
            vm.open = openModalCreateProject;
            vm.addLecture = openModalCreateLecture;
            vm.synchronized = false;
            vm.isActive = isActive;

            vm.activeSubjectId = vm.user.subjects.length > 0 ? vm.user.subjects[0].id : null;
            vm.activeLectureId = vm.activeSubjectId && vm.user.subjects[0].lectures ? user.subjects[0].lectures[0] : null;

            vm.deleteSubject = deleteSubject;
            vm.setCurrentProject = setCurrentProject;
            vm.currentProjectID = user.currentProjectID;
            vm.updateSheet = updateSheet;
            vm.updateActiveSubject = updateActiveSubject;

            function updateSheet(lecture, subject) {
                $rootScope.$broadcast('UpdateSheet', {lecture: lecture, subject: subject});
                updateActiveLeactures(lecture);
            }

            function updateActiveLeactures(inputLecture) {
                clearActiveLecture();

                for (var i = 0; i < vm.user.subjects.length; i++) {
                    for (var j = 0; i < i.length; i++) {
                        if (vm.user.subjects[i][j].id === inputLecture.id) {
                            vm.user.subjects[i][j].isActive = true;
                        }
                    }
                }
            }

            function clearActiveLecture() {

                for (var i = 0; i < vm.user.subjects.length; i++) {
                    for (var j = 0; i < i.length; i++) {
                        vm.user.subjects[i][j].isActive = false;
                    }
                }
            }

            function updateActiveSubject(inputSublect) {
                clearActiveSublect();
                vm.user.subjects.forEach(function (subject) {
                    if (inputSublect.id === subject.id) {
                        subject.isCollapsed = false;
                        subject.isActive = true;
                    }
                });
            }

            function clearActiveSublect() {
                vm.user.subjects.forEach(function (subject) {
                    subject.isCollapsed = true;
                    subject.isActive = false;
                });
            }

            //var Trello = authservice.authorize();

            //createProjectFactory.syncProjAndOrg(Trello).then(function (res) {
            sidebarFactory.findProjects().then(function (data) {
                vm.projects = data;
                if (data.length === 0) {
                    logger.error('Create the first project to start');
                }
                vm.synchronized = true;
            });
            //});

            function isActive(lecture) {
                return lecture.isActive;
            }

            function deleteSubject(subject) {
                $http.delete(apiUrl.host + vm.user.tocken + '/' + subject.id).then(
                    function () {
                        logger.success('Видалено успішно');
                        $http.get(apiUrl.host + vm.user.tocken + '/all')
                            .then(function (res) {
                                user.subjects = res.data.subjects;
                                localStorage.setItem('user', JSON.stringify(user));
                            })
                    }
                )
            }

            function openModalCreateProject() {
                var modalCreateProject = $uibModal.open({
                        templateUrl: 'app/layout/add-project.html',
                        controller: function ($uibModalInstance) {

                            var vmModal = this;
                            vmModal.createProjAndOrg = createProjAndOrg;
                            vmModal.dismiss = modalCreateProject.dismiss;

                            vmModal.outputBacklogList = vmModal.backlogLists;
                            vmModal.outputWorkingList = vmModal.workingLists;

                            // Function creates Project and Trello Organization
                            function createProjAndOrg() {
                                var projectName = vmModal.projectName;


                                if (projectName !== '')
                                    createOrganization(projectName);
                                else logger.error('Please fill the project name.');

                                function createOrganization(projectName) {
                                    var sendData = {
                                        title: projectName
                                    };
                                    $http.put(apiUrl.host + vm.user.tocken, sendData).then(
                                        function () {
                                            $http.get(apiUrl.host + vm.user.tocken)
                                                .then(function (res) {
                                                    user.subjects = res.data.subjects;
                                                    $uibModalInstance.dismiss();
                                                })
                                        }
                                    )
                                }
                            }

                            function changeModal() {
                                modalCreateProject.dismiss();

                                var modalProjectCreated = $uibModal.open({
                                    templateUrl: 'app/layout/project-added.html',
                                    controller: function () {

                                        var vmSidebarModal = this;

                                        vmSidebarModal.exit = function () {
                                            modalProjectCreated.dismiss();
                                        };
                                    },
                                    controllerAs: 'vmSidebarModal'
                                });
                            }
                        },
                        controllerAs: 'vmModal'
                    }
                );
            }

            function openModalCreateLecture(subject) {
                var modalCreateProject = $uibModal.open({
                        templateUrl: 'app/layout/add-lecture.html',
                        controller: function ($uibModalInstance) {

                            var vmModal = this;
                            vmModal.SubjectName = subject.title;
                            vmModal.createProjAndOrgLecture = createProjAndOrgLecture;
                            vmModal.dismiss = modalCreateProject.dismiss;

                            function createProjAndOrgLecture() {
                                var lectureName = vmModal.lectureName;

                                if (lectureName !== '')
                                    createOrganization(lectureName);
                                else logger.error('Please fill the project name.');

                                function createOrganization(lectureName) {
                                    var sendData = {
                                        title: lectureName,
                                        html: ''
                                    };
                                    $http.put(apiUrl.host + vm.user.tocken + '/' + subject.id, sendData).then(
                                        function () {
                                            $http.get(apiUrl.host + vm.user.tocken + '/all')
                                                .then(function (res) {
                                                    user.subjects = res.data.subjects;
                                                    localStorage.setItem('user', JSON.stringify(user));
                                                    $uibModalInstance.dismiss();
                                                })
                                        }
                                    )
                                }
                            }

                            function changeModal() {
                                modalCreateProject.dismiss();

                                var modalProjectCreated = $uibModal.open({
                                    templateUrl: 'app/layout/project-added.html',
                                    controller: function () {

                                        var vmSidebarModal = this;

                                        vmSidebarModal.exit = function () {
                                            modalProjectCreated.dismiss();
                                        };
                                    },
                                    controllerAs: 'vmSidebarModal'
                                });
                            }
                        },
                        controllerAs: 'vmModal'
                    }
                );
            }

            function setCurrentProject($event) {
                $event.preventDefault();
                var projectId = $event.target.id;

                user.changeCurrentProject(projectId);
                $state.reload();
            }

            function setCustomContent(idOrganization, outputBacklogList, outputWorkingList) {
                var backlog, working, bLists, wLists;

                //backlog = new ManageTrelloProject.Board('Backlog');
                //working = new ManageTrelloProject.Board('Working');

                bLists = [];
                wLists = [];
                var newList;

                //for (var i = 0; i < outputBacklogList.length; i++) {
                //    newList = new ManageTrelloProject.List(outputBacklogList[i].name);
                //    newList.closed = !outputBacklogList[i].ticked;
                //    bLists.push(newList);
                //}
                //for (i = 0; i < outputWorkingList.length; i++) {
                //    newList = new ManageTrelloProject.List(outputWorkingList[i].name);
                //    newList.closed = !outputWorkingList[i].ticked;
                //    wLists.push(newList);
                //}
                //for (i = 0; i < bLists.length; i++) {
                //    backlog.lists.push(bLists[i]);
                //}
                //for (i = 0; i < wLists.length; i++) {
                //    working.lists.push(wLists[i]);
                //}

                //ManageTrelloProject.addBoard(backlog, idOrganization);
                //ManageTrelloProject.addBoard(working, idOrganization);
            }
        }

        return directive;
    }
})();
