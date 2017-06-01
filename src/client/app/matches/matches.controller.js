var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        var MatchesController = (function () {
            function MatchesController($q, $state, $stateParams, fixtures, season, logger, Predictions) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.fixtures = fixtures;
                this.season = season;
                this.logger = logger;
                this.Predictions = Predictions;
                this.title = 'Matches';
                this.predictions = {};
                this.createPredictions = function () {
                    var predictions = _this.Predictions.newInstance(_this.predictions);
                    predictions.save(function (response) {
                        console.log(response);
                    }, function (errorResponse) {
                        this.error = errorResponse.data.message;
                    });
                };
                this.score = function (match, side, change) {
                    _this.predictions[match] = _this.predictions[match] || {};
                    var goals = _this.predictions[match]['goals' + side + 'Team'];
                    if (!(goals == null) && !(goals === 0 && change === -1)) {
                        goals += change;
                    }
                    _this.predictions[match]['goals' + side + 'Team'] = goals || 0;
                };
                this.currentRound = this.season.currentRound;
                this.leagueSlug = this.$stateParams.league || this.season.league.slug;
                this.seasonSlug = this.$stateParams.season || this.season.slug;
                var matchday = parseInt(this.$stateParams.round || this.currentRound);
                this.matchday = matchday;
            }
            MatchesController.prototype.pointsClass = function (points) {
                if (points === 3) {
                    return 'label-success';
                }
                else if (points === 2) {
                    return 'label-warning';
                }
                else {
                    return 'label-danger';
                }
            };
            ;
            MatchesController.prototype.nextMatchday = function () {
                if (this.matchday < this.season.numberOfRounds) {
                    this.matchday += 1;
                    this.gotoMatchday();
                }
            };
            MatchesController.prototype.prevMatchday = function () {
                if (this.matchday > 1) {
                    this.matchday -= 1;
                    this.gotoMatchday();
                }
            };
            MatchesController.prototype.currMatchday = function () {
                this.matchday = this.currentRound;
                this.gotoMatchday();
            };
            MatchesController.prototype.gotoMatchday = function () {
                this.$state.go('app.matches', {
                    league: this.leagueSlug,
                    season: this.seasonSlug,
                    round: this.matchday
                });
            };
            return MatchesController;
        }());
        MatchesController.$inject = ['$q', '$state', '$stateParams', 'matches', 'season', 'logger', 'PredictionsResource'];
        matches.MatchesController = MatchesController;
        angular
            .module('app.matches')
            .controller('MatchesController', MatchesController);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.controller.js.map