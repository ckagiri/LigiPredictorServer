var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        var MatchesController = (function () {
            function MatchesController($q, $state, $stateParams, fixtures, season, logger, Predictions, vosePredictorFactory) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.fixtures = fixtures;
                this.season = season;
                this.logger = logger;
                this.Predictions = Predictions;
                this.vosePredictorFactory = vosePredictorFactory;
                this.title = 'Matches';
                this.predictions = {};
                this.createPredictions = function () {
                    var predictions = _this.Predictions.newInstance(_this.predictions);
                    predictions.save(function (response) {
                        _this.logger.success('Successfully Saved!');
                    }, function (errorResponse) {
                        _this.error = errorResponse.data.message;
                    });
                };
                this.score = function (match, side, change) {
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
                this.init();
            }
            MatchesController.prototype.init = function () {
                var _this = this;
                var _loop_1 = function (match) {
                    if (!match.result) {
                        var choice = match.prediction.choice || {};
                        this_1.predictions[match._id] = this_1.predictions[match._id] || {};
                        this_1.predictions[match._id]['_id'] = match.prediction._id;
                        if (!choice.isComputerGenerated) {
                            this_1.predictions[match._id]['goalsHomeTeam'] = choice.goalsHomeTeam;
                            this_1.predictions[match._id]['goalsAwayTeam'] = choice.goalsAwayTeam;
                        }
                        this_1.predictions[match._id]['vosePredictor'] = this_1.vosePredictorFactory.createPredictor(match.odds);
                        this_1.predictions[match._id]['predict'] = function () {
                            var prediction = _this.predictions[match._id];
                            var predictor = prediction['vosePredictor'];
                            var score = predictor.predict();
                            var goals = score.split('-');
                            var goalsHomeTeam = goals[0];
                            var goalsAwayTeam = goals[1];
                            prediction['goalsHomeTeam'] = goalsHomeTeam;
                            prediction['goalsAwayTeam'] = goalsAwayTeam;
                        };
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    _loop_1(match);
                }
            };
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
            MatchesController.prototype.luckyDip = function () {
                var _this = this;
                Object.keys(this.predictions).forEach(function (key) {
                    _this.predictions[key].predict();
                });
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
        MatchesController.$inject = ['$q', '$state', '$stateParams', 'matches', 'season', 'logger',
            'PredictionsResource', 'vosePredictorFactory'];
        matches.MatchesController = MatchesController;
        angular
            .module('app.matches')
            .controller('MatchesController', MatchesController);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.controller.js.map