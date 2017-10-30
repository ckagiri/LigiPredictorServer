var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var LeaderboardService = (function () {
            function LeaderboardService() {
            }
            return LeaderboardService;
        }());
        core.LeaderboardService = LeaderboardService;
        angular
            .module('app.core')
            .service('leaderboardService', LeaderboardService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboard.service.js.map