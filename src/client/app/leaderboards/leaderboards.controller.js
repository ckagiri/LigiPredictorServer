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
                var d = new Date();
                this.month = this.$stateParams.month || d.getUTCMonth() + 1;
                this.year = this.$stateParams.year || d.getFullYear();
                this.activate();
            }
            LeaderboardsController.prototype.activate = function () {
                var _this = this;
                this.leaderboardService.getCurrentDefaults()
                    .then(function (data) {
                    console.log(data);
                    var round = data.round, month = data.month, year = data.year;
                    _this.round = round;
                    _this.month = month;
                    _this.year = year;
                    _this.initDropDowns();
                    _this.getSeasonLeaderboard();
                    _this.getSeasonRoundLeaderboard();
                    _this.getSeasonMonthLeaderboard();
                });
            };
            LeaderboardsController.prototype.getSeasonLeaderboard = function () {
                var _this = this;
                this.leaderboardService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
                    .then(function (data) {
                    _this.seasonLeaderboard = data;
                });
            };
            LeaderboardsController.prototype.getSeasonRoundLeaderboard = function () {
                var _this = this;
                if (this.selectedRound != null) {
                    this.round = this.selectedRound.id;
                }
                this.leaderboardService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
                    .then(function (data) {
                    _this.seasonRoundLeaderboard = data;
                });
            };
            LeaderboardsController.prototype.getSeasonMonthLeaderboard = function () {
                var _this = this;
                console.log(this.month);
                if (this.selectedMonth != null) {
                    this.month = this.selectedMonth.id;
                }
                this.leaderboardService.getSeasonMonthLeaderboard(this.leagueSlug, this.seasonSlug, this.year, this.month)
                    .then(function (data) {
                    _this.seasonMonthLeaderboard = data;
                });
            };
            LeaderboardsController.prototype.initDropDowns = function () {
                this.rounds = Array.apply(null, { length: this.round }).map(function (value, index) {
                    return {
                        id: index + 1,
                        name: index + 1
                    };
                });
                this.months = Array.apply(null, { length: 12 }).map(function (value, index) {
                    return {
                        id: index + 1,
                        name: index + 1
                    };
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