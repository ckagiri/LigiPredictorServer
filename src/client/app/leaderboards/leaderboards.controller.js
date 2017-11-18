var app;
(function (app) {
    var leaderboards;
    (function (leaderboards) {
        'use strict';
        var LeaderboardsController = (function () {
            function LeaderboardsController($q, $state, $stateParams, $scope, logger, season, leaderboardService) {
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$scope = $scope;
                this.logger = logger;
                this.season = season;
                this.leaderboardService = leaderboardService;
                this.title = 'Leaderboards';
                this.leagueSlug = this.$stateParams.league || this.season.league.slug;
                this.seasonSlug = this.$stateParams.season || this.season.slug;
                this.round = this.$stateParams.round || this.season.currentRound;
                this.activate();
            }
            LeaderboardsController.prototype.activate = function () {
                var _this = this;
                var d = new Date();
                var month = d.getUTCMonth() + 1;
                var year = d.getFullYear();
                this.leaderboardService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
                    .then(function (data) {
                    _this.seasonLeaderboard = data;
                });
                this.leaderboardService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
                    .then(function (data) {
                    _this.seasonRoundLeaderboard = data;
                });
                this.leaderboardService.getSeasonMonthLeaderboard(this.leagueSlug, this.seasonSlug, year, month)
                    .then(function (data) {
                    _this.seasonMonthLeaderboard = data;
                });
            };
            return LeaderboardsController;
        }());
        LeaderboardsController.$inject = ['$q', '$state', '$stateParams', '$scope', 'logger', 'season', 'leaderboardService'];
        leaderboards.LeaderboardsController = LeaderboardsController;
        angular
            .module('app.leaderboards')
            .controller('LeaderboardsController', LeaderboardsController);
    })(leaderboards = app.leaderboards || (app.leaderboards = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.controller.js.map