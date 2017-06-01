var admin;
(function (admin) {
    var users;
    (function (users) {
        'use strict';
        angular
            .module('admin.users')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'admin.users',
                    config: {
                        url: '/users',
                        templateUrl: 'app/admin/users/users.html',
                        controller: 'UsersController',
                        controllerAs: 'vm',
                        title: 'users',
                        resolve: {
                            users: ['$stateParams', 'UsersResource',
                                function ($stateParams, Users) {
                                    return Users.all();
                                }]
                        }
                    }
                },
                {
                    state: 'admin.user-detail',
                    config: {
                        url: '/users/:id',
                        templateUrl: 'app/admin/users/users.html',
                        controller: 'UsersController',
                        controllerAs: 'vm',
                        title: 'users',
                        resolve: {
                            users: ['$stateParams', 'UsersResource',
                                function ($stateParams, Users) {
                                    return Users.getById($stateParams.id);
                                }]
                        }
                    }
                }
            ];
        }
    })(users = admin.users || (admin.users = {}));
})(admin || (admin = {}));
//# sourceMappingURL=users.route.js.map