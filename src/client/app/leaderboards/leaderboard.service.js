var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var LeaderboardService = (function () {
            function LeaderboardService($http, $q, exception, logger) {
                var _this = this;
                this.$http = $http;
                this.$q = $q;
                this.exception = exception;
                this.logger = logger;
                this.success = function (response) { return response.data; };
                this.fail = function (error) {
                    var msg = error.data.description;
                    var reason = 'query for leaderboard failed.';
                    _this.exception.catcher(msg)(reason);
                    return _this.$q.reject(msg);
                };
            }
            LeaderboardService.prototype.getCurrentDefaults = function () {
                return this.$http.get('/api/matches/current-defaults')
                    .then(this.success)
                    .catch(this.fail);
            };
            LeaderboardService.prototype.getSeasonLeaderboard = function (leagueSlug, seasonSlug) {
                return this.$http.get("/api/leaderboard/league/" + leagueSlug + "/season/" + seasonSlug)
                    .then(this.success)
                    .catch(this.fail);
            };
            LeaderboardService.prototype.getSeasonRoundLeaderboard = function (leagueSlug, seasonSlug, round) {
                return this.$http.get("/api/leaderboard/league/" + leagueSlug + "/season/" + seasonSlug + "/round/" + round)
                    .then(this.success)
                    .catch(this.fail);
            };
            LeaderboardService.prototype.getSeasonMonthLeaderboard = function (leagueSlug, seasonSlug, year, month) {
                return this.$http.get("/api/leaderboard/league/" + leagueSlug + "/season/" + seasonSlug + "/year/" + year + "/month/" + month)
                    .then(this.success)
                    .catch(this.fail);
            };
            return LeaderboardService;
        }());
        LeaderboardService.$inject = ['$http', '$q', 'exception', 'logger'];
        core.LeaderboardService = LeaderboardService;
        angular
            .module('app.core')
            .service('leaderboardService', LeaderboardService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboard.service.js.map