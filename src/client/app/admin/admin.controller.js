var app;
(function (app) {
    var admin;
    (function (admin) {
        'use strict';
        var AdminController = (function () {
            function AdminController(logger) {
                this.logger = logger;
                this.title = 'Admin';
                this.logger.info('Activated Admin View');
            }
            return AdminController;
        }());
        AdminController.$inject = ['logger'];
        admin.AdminController = AdminController;
        angular
            .module('app.admin')
            .controller('AdminController', AdminController);
    })(admin = app.admin || (app.admin = {}));
})(app || (app = {}));
//# sourceMappingURL=admin.controller.js.map