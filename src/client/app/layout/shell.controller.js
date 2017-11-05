var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var ShellController = /** @class */ (function () {
            function ShellController($rootScope, $timeout, breadcrumbs, config, logger) {
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.breadcrumbs = breadcrumbs;
                this.config = config;
                this.logger = logger;
                this.logger.success(config.appTitle + ' loaded!', null);
            }
            ShellController.prototype.isAdmin = function () {
                return false;
            };
            ShellController.$inject = ['$rootScope', '$timeout', 'breadcrumbs', 'config', 'logger'];
            return ShellController;
        }());
        layout.ShellController = ShellController;
        angular
            .module('app.layout')
            .controller('ShellController', ShellController);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=shell.controller.js.map