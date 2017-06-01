var app;
(function (app) {
    var leaderboards;
    (function (leaderboards) {
        'use strict';
        var LeaderboardsController = (function () {
            function LeaderboardsController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Leaderboards';
            }
            return LeaderboardsController;
        }());
        LeaderboardsController.$inject = ['$q', 'logger'];
        leaderboards.LeaderboardsController = LeaderboardsController;
        angular
            .module('app.leaderboards')
            .controller('LeaderboardsController', LeaderboardsController);
    })(leaderboards = app.leaderboards || (app.leaderboards = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.controller.js.map