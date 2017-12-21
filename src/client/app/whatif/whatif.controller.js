var app;
(function (app) {
    var whatif;
    (function (whatif) {
        'use strict';
        var WhatIfController = (function () {
            function WhatIfController($q, $window, storage, logger, leagueSeasonFactory, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this.logger = logger;
                this.leagueSeasonFactory = leagueSeasonFactory;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'WhatIf';
                this.goalsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                this.canClear = false;
                this.activate();
            }
            WhatIfController.prototype.activate = function () {
                var compressed = this.storage.getItem('compressed-fixtures');
                if (compressed != null) {
                    this.localRefresh(compressed);
                }
                else {
                    this.serverRefresh();
                }
            };
            WhatIfController.prototype.serverRefresh = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    var compressed = data.compressed;
                    _this.storage.setItem('compressed-fixtures', compressed);
                    _this.localRefresh(compressed);
                });
            };
            WhatIfController.prototype.localRefresh = function (compressed) {
                var _this = this;
                this.fixtures = this.$window.lzwCompress.unpack(compressed);
                this.season = this.leagueSeasonFactory.createLeagueSeason(this.fixtures);
                this.season1 = angular.copy(this.season);
                this.roundsPlayed = this.leagueSeasonFactory.getRoundsPlayed(this.fixtures);
                var predRounds = Array.apply(null, { length: this.roundsPlayed }).map(function (value, index) {
                    return {
                        id: index + 1,
                        name: index + 1
                    };
                });
                this.predRounds = predRounds.reverse();
                this.predRound = this.roundsPlayed;
                this.selectedPredRound = this.predRounds.filter(function (n) { return n.id == _this.predRound; })[0];
                this.onPredStandingRoundChanged();
            };
            WhatIfController.prototype.goalsChanged = function () {
                this.season.assign();
                this.season1 = angular.copy(this.season);
                this.canClear = true;
            };
            WhatIfController.prototype.isFirstRound = function () {
                return this.season && this.season.isFirstRound();
            };
            WhatIfController.prototype.isLastRound = function () {
                return this.season && this.season.isLastRound();
            };
            WhatIfController.prototype.prevRound = function () {
                this.season.prevRound();
                this.season1.prevRound();
            };
            WhatIfController.prototype.nextRound = function () {
                this.season.nextRound();
                this.season1.nextRound();
            };
            WhatIfController.prototype.addHomeScore = function (match) {
                match.setScore(match.getHomeScore() + 1, match.getAwayScore());
                this.season.assign();
                this.season1 = angular.copy(this.season);
            };
            WhatIfController.prototype.addAwayScore = function (match) {
                match.setScore(match.getHomeScore(), match.getAwayScore() + 1);
                this.season.assign();
                this.season1 = angular.copy(this.season);
            };
            WhatIfController.prototype.onPredStandingRoundChanged = function () {
                this.predRound = this.selectedPredRound.id;
                this.predSeason = this.leagueSeasonFactory.createLeagueSeason(this.fixtures, true, this.predRound);
                var closestMatchDate = this.leagueSeasonFactory.closestMatchDate(this.fixtures);
                var moment = this.$window.moment;
                var now = moment();
                var closestTime = moment(closestMatchDate);
                var diff = Math.abs(closestTime.diff(now, 'minutes'));
                console.log('diff', diff);
                if (diff < 60) {
                    this.serverRefresh();
                }
            };
            WhatIfController.prototype.clearAll = function () {
                var compressed = this.storage.getItem('compressed-fixtures');
                this.localRefresh(compressed);
                this.canClear = false;
            };
            return WhatIfController;
        }());
        WhatIfController.$inject = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory',
            'fixturePredictionService',];
        whatif.WhatIfController = WhatIfController;
        angular
            .module('app.whatif')
            .controller('WhatIfController', WhatIfController);
    })(whatif = app.whatif || (app.whatif = {}));
})(app || (app = {}));
//# sourceMappingURL=whatif.controller.js.map