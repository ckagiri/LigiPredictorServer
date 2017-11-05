var app;
(function (app) {
    var stats;
    (function (stats) {
        'use strict';
        var StatsController = /** @class */ (function () {
            function StatsController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Stats';
            }
            StatsController.$inject = ['$q', 'logger'];
            return StatsController;
        }());
        stats.StatsController = StatsController;
        angular
            .module('app.stats')
            .controller('StatsController', StatsController);
    })(stats = app.stats || (app.stats = {}));
})(app || (app = {}));
//# sourceMappingURL=stats.controller.js.map