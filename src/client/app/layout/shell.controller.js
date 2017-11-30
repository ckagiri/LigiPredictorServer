var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var ShellController = (function () {
            function ShellController($rootScope, $timeout, breadcrumbs, config, logger, security) {
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.breadcrumbs = breadcrumbs;
                this.config = config;
                this.logger = logger;
                this.security = security;
                this.logger.success(config.appTitle + ' loaded!', null);
            }
            ShellController.prototype.isAdmin = function () {
                return this.security.isAdmin();
            };
            return ShellController;
        }());
        ShellController.$inject = ['$rootScope', '$timeout', 'breadcrumbs', 'config', 'logger', 'securityService'];
        layout.ShellController = ShellController;
        angular
            .module('app.layout')
            .controller('ShellController', ShellController);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=shell.controller.js.map