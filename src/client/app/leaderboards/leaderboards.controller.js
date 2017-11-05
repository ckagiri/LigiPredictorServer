var app;
(function (app) {
    var leaderboards;
    (function (leaderboards) {
        'use strict';
        var LeaderboardsController = /** @class */ (function () {
            function LeaderboardsController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Leaderboards';
            }
            LeaderboardsController.$inject = ['$q', 'logger'];
            return LeaderboardsController;
        }());
        leaderboards.LeaderboardsController = LeaderboardsController;
        angular
            .module('app.leaderboards')
            .controller('LeaderboardsController', LeaderboardsController);
    })(leaderboards = app.leaderboards || (app.leaderboards = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.controller.js.map