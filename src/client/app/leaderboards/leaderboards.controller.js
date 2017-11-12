var app;
(function (app) {
    var leaderboards;
    (function (leaderboards) {
        'use strict';
        var LeaderboardsController = (function () {
            function LeaderboardsController($q, $state, $stateParams, $scope, logger, season, leaderboarService) {
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$scope = $scope;
                this.logger = logger;
                this.season = season;
                this.leaderboarService = leaderboarService;
                this.title = 'Leaderboards';
                this.leagueSlug = this.$stateParams.league || this.season.league.slug;
                this.seasonSlug = this.$stateParams.season || this.season.slug;
                this.round = this.$stateParams.round || this.season.currentRound;
                this.activate();
            }
            LeaderboardsController.prototype.activate = function () {
                var _this = this;
                this.leaderboarService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
                    .then(function (data) {
                    _this.seasonLeaderboard = data;
                });
                this.leaderboarService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
                    .then(function (data) {
                    _this.seasonRoundLeaderboard = data;
                });
                this.leaderboarService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
                    .then(function (data) {
                    _this.seasonMonthLeaderboard = data;
                });
            };
            return LeaderboardsController;
        }());
        LeaderboardsController.$inject = ['$q', '$state', '$stateParams', '$scope', 'logger', 'season', 'leaderboarService'];
        leaderboards.LeaderboardsController = LeaderboardsController;
        angular
            .module('app.leaderboards')
            .controller('LeaderboardsController', LeaderboardsController);
    })(leaderboards = app.leaderboards || (app.leaderboards = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.controller.js.map