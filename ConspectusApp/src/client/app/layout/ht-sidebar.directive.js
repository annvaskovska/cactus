(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htSidebar', htSidebar);

    /* @ngInject */
    function htSidebar () {
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

        SidebarController.$inject = ['$uibModal', 'logger', 'sidebarFactory', 'authservice', 'createProjectFactory',
            'user', 'ManageTrelloProject', '$state', '$rootScope'];

        /* @ngInject */

        function SidebarController($uibModal, logger, sidebarFactory, authservice,
                                   createProjectFactory, user, ManageTrelloProject, $state, $rootScope) {

            var vm = this;
            vm.open = openModalCreateProject;
            vm.synchronized = false;
            vm.isActive = isActive;

            vm.setCurrentProject = setCurrentProject;
            vm.currentProjectID = user.currentProjectID;
            vm.updateSheet =  updateSheet;
            vm.updateActiveSubject = updateActiveSubject;
            vm.subjects = [
                {
                    title: 'Subject 1',
                    id: 1,
                    isActive: true,
                    isCollapsed: false,
                    lectures: [
                        {
                            id: 11,
                            title: 'Lecture 11',
                            html: '<h2>hello lect 11</h2>',
                            isActive: true
                        },
                        {
                            id: 12,
                            title: 'Lecture 12',
                            html: '<h2>hello lect 12</h2>'
                        }
                    ]
                },{
                    title: 'Subject 2',
                    id: 2,
                    isCollapsed: true,
                    lectures: [
                        {
                            id: 21,
                            title: 'Lecture 21',
                            html: 'hello lect 11'
                        },
                        {
                            id: 22,
                            title: 'Lecture 22',
                            html: 'hello lect 12'
                        }
                    ]
                },
                {
                    title: 'Subject 3',
                    id: 3,
                    isCollapsed: true,
                    lectures: [
                        {
                            id: 31,
                            title: 'Lecture 31',
                            html: 'hello lect 11'
                        },
                        {
                            id: 32,
                            title: 'Lecture 32',
                            html: 'hello lect 12'
                        }
                    ]
                }
            ];

            function updateSheet(lecture) {
                $rootScope.$broadcast('UpdateSheet', {lecture: lecture});
                updateActiveLeactures(lecture);
            }

            function updateActiveLeactures(inputLecture) {
                clearActiveLecture();
                vm.subjects.forEach(function(subject) {
                    subject.lectures.forEach(function(lecture) {
                        if(lecture.id === inputLecture.id) {
                            lecture.isActive = true;
                        }
                    })
                });
            }

            function clearActiveLecture() {
                vm.subjects.forEach(function(subject) {
                    subject.lectures.forEach(function(lecture) {
                        lecture.isActive = false;
                    })
                });
            }

            function updateActiveSubject(inputSublect) {
                clearActiveSublect();
                vm.subjects.forEach(function(subject) {
                    if(inputSublect.id === subject.id) {
                        subject.isCollapsed = false;
                        subject.isActive = true;
                    }
                });
            }

            function clearActiveSublect() {
                vm.subjects.forEach(function(subject) {
                   subject.isCollapsed = true;
                   subject.isActive = false;
                });
            }

            //var Trello = authservice.authorize();

            //createProjectFactory.syncProjAndOrg(Trello).then(function (res) {
            sidebarFactory.findProjects().then(function(data) {
                vm.projects = data;
                if (data.length === 0) {
                    logger.error('Create the first project to start');
                }
                vm.synchronized = true;
            });
            //});

            function isActive (lecture) {
                return lecture.isActive;
            }

            function openModalCreateProject () {
                var modalCreateProject = $uibModal.open({
                        templateUrl: 'app/layout/add-project.html',
                        controller: function ($uibModalInstance) {

                            var vmModal = this;
                            vmModal.createProjAndOrg = createProjAndOrg;
                            vmModal.dismiss = modalCreateProject.dismiss;

                            // data for trello boards creation
                            vmModal.backlogLists = ManageTrelloProject.getBacklogLists();
                            vmModal.workingLists = ManageTrelloProject.getWorkingLists();
                            vmModal.outputBacklogList = vmModal.backlogLists;
                            vmModal.outputWorkingList = vmModal.workingLists;

                            // Function creates Project and Trello Organization
                            function createProjAndOrg() {
                                var projectName = vmModal.projectName,
                                    projectDescription = vmModal.projectDescription;

                                if (projectName !== '')
                                    createOrganization(projectName, projectDescription);
                                else logger.error('Please fill the project name.');

                                function createOrganization(projectName, projectDescription) {

                                    if (Trello.authorized()) {

                                        createProjectFactory.createProjAndOrg(Trello,
                                            projectName, projectDescription)
                                            .then(function (res) {

                                                console.log(res);
                                                setCustomContent(res, vmModal.outputBacklogList,
                                                    vmModal.outputWorkingList);

                                                sidebarFactory.findProjects().then(function(data) {
                                                    vm.projects = data;
                                                    changeModal();
                                                });
                                            },

                                            function (err) {
                                                logger.error('New project has not been created.');
                                            }
                                        );
                                    }
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

                backlog = new ManageTrelloProject.Board('Backlog');
                working = new ManageTrelloProject.Board('Working');

                bLists = [];
                wLists = [];
                var newList;

                for (var i = 0; i < outputBacklogList.length; i++) {
                    newList = new ManageTrelloProject.List(outputBacklogList[i].name);
                    newList.closed = !outputBacklogList[i].ticked;
                    bLists.push(newList);
                }
                for (i = 0; i < outputWorkingList.length; i++) {
                    newList = new ManageTrelloProject.List(outputWorkingList[i].name);
                    newList.closed = !outputWorkingList[i].ticked;
                    wLists.push(newList);
                }
                for (i = 0; i < bLists.length; i++) {
                    backlog.lists.push(bLists[i]);
                }
                for (i = 0; i < wLists.length; i++) {
                    working.lists.push(wLists[i]);
                }

                ManageTrelloProject.addBoard(backlog, idOrganization);
                ManageTrelloProject.addBoard(working, idOrganization);
            }
        }

        return directive;
    }
})();
