var admin;
(function (admin) {
    var users;
    (function (users_1) {
        'use strict';
        var UsersController = /** @class */ (function () {
            function UsersController($q, users, logger) {
                this.$q = $q;
                this.users = users;
                this.logger = logger;
                this.title = 'Users';
            }
            UsersController.$inject = ['$q', 'users', 'logger'];
            return UsersController;
        }());
        users_1.UsersController = UsersController;
        angular
            .module('admin.users')
            .controller('UsersController', UsersController);
    })(users = admin.users || (admin.users = {}));
})(admin || (admin = {}));
//# sourceMappingURL=users.controller.js.map