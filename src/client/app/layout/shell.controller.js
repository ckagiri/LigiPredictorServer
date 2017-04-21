var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var ShellController = (function () {
            function ShellController($rootScope, $timeout, config, logger) {
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.config = config;
                this.logger = logger;
                this.logger.success(config.appTitle + ' loaded!', null);
            }
            return ShellController;
        }());
        ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
        layout.ShellController = ShellController;
        angular
            .module('app.layout')
            .controller('ShellController', ShellController);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=shell.controller.js.map