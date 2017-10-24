var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        var MatchesController = (function () {
            function MatchesController($q, $state, $stateParams, $scope, fixtures, season, logger, predictionService, vosePredictorFactory, cache) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$scope = $scope;
                this.fixtures = fixtures;
                this.season = season;
                this.logger = logger;
                this.predictionService = predictionService;
                this.vosePredictorFactory = vosePredictorFactory;
                this.cache = cache;
                this.title = 'Matches';
                this.predictions = {};
                this.luckySpinEnabled = false;
                this.submitButtonEnabled = false;
                this.stateKey = 'public.matches';
                this.jokerChosen = "chosen";
                this.hasJoker = false;
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.makePredictions = function () {
                    if (Object.keys(_this.predictions).length == 0)
                        return;
                    var request = {
                        predictions: _this.predictions
                    };
                    _this.predictionService.submitPredictions(request)
                        .then(function (predictions) {
                        for (var _i = 0, predictions_1 = predictions; _i < predictions_1.length; _i++) {
                            var p = predictions_1[_i];
                            for (var _a = 0, _b = _this.fixtures; _a < _b.length; _a++) {
                                var f = _b[_a];
                                if (p.fixture == f._id) {
                                    delete f['vosePredictor'];
                                    delete f['predict'];
                                }
                            }
                        }
                        _this.logger.success('Successfully Saved!');
                    }, function (errorResponse) {
                        _this.error = errorResponse.data.message;
                    });
                };
                this.score = function (match, side, change) {
                    var matchId = match._id;
                    if (_this.predictions[matchId] == null) {
                        _this.predictions[matchId] = {
                            _id: match.prediction._id,
                            goalsHomeTeam: match.choice.goalsHomeTeam,
                            goalsAwayTeam: match.choice.goalsAwayTeam
                        };
                    }
                    var goals = match.choice['goals' + side + 'Team'];
                    if (!(goals == null) && !(goals === 0 && change === -1)) {
                        goals += change;
                    }
                    _this.predictions[matchId]['goals' + side + 'Team'] = goals || 0;
                    match.choice['goals' + side + 'Team'] = goals || 0;
                };
                this.currentRound = this.season.currentRound;
                this.leagueSlug = this.$stateParams.league || this.season.league.slug;
                this.seasonSlug = this.$stateParams.season || this.season.slug;
                var matchday = parseInt(this.$stateParams.round || this.currentRound);
                this.matchday = matchday;
                this.onDestroy();
                this.restoreState();
                this.refresh();
            }
            MatchesController.prototype.refresh = function () {
                var _this = this;
                var _loop_1 = function (match) {
                    var choice = match.prediction.choice || {};
                    if (match.status == 'SCHEDULED' || match.status == 'TIMED') {
                        if (this_1.jokerChosen === "chosen" && !this_1.hasJoker) {
                            this_1.jokerChosen = "";
                        }
                        if (choice.isComputerGenerated || choice.isComputerGenerated == null) {
                            var odds = match.odds;
                            if (odds == null) {
                                odds = { homeWin: 1, awayWin: 1, draw: 1 };
                            }
                            match['vosePredictor'] = this_1.vosePredictorFactory.createPredictor(odds);
                            match['predict'] = function () {
                                var predictor = match['vosePredictor'];
                                var score = predictor.predict();
                                var goals = score.split('-');
                                var goalsHomeTeam = goals[0];
                                var goalsAwayTeam = goals[1];
                                match.choice = {
                                    goalsHomeTeam: goalsHomeTeam, goalsAwayTeam: goalsAwayTeam
                                };
                                if (_this.predictions[match._id] == null) {
                                    _this.predictions[match._id] = {
                                        _id: match.prediction._id
                                    };
                                }
                                _this.predictions[match._id]['goalsHomeTeam'] = goalsHomeTeam;
                                _this.predictions[match._id]['goalsAwayTeam'] = goalsAwayTeam;
                            };
                            match.choice = {
                                goalsHomeTeam: null,
                                goalsAwayTeam: null
                            };
                            this_1.luckySpinEnabled = true;
                        }
                        else {
                            match.choice = choice;
                        }
                    }
                    else {
                        match.choice = choice;
                    }
                    this_1.totalPoints += match.prediction.points || 0;
                    this_1.totalGoalDiff += match.prediction.goalDiff || 0;
                    if (match.prediction.hasJoker) {
                        this_1.jokerChosen = "chosen";
                        this_1.hasJoker = true;
                        if (match.prediction.goalDiff >= 0 && match.prediction.points > 0) {
                            this_1.totalPoints += match.prediction.points || 0;
                            this_1.totalGoalDiff += match.prediction.goalDiff || 0;
                        }
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    _loop_1(match);
                }
            };
            MatchesController.prototype.pointsClass = function (fixture) {
                if (fixture.status === 'IN_PLAY') {
                    return 'label-warning';
                }
                var points = fixture.prediction.points;
                if (points > 0) {
                    return 'label-success';
                }
                return 'label-default';
            };
            MatchesController.prototype.diffClass = function (fixture) {
                if (fixture.status === 'IN_PLAY') {
                    return 'label-warning';
                }
                var diff = fixture.prediction.goalDiff;
                if (diff > 0) {
                    return 'label-success';
                }
                if (diff < 0) {
                    return 'label-danger';
                }
                return 'label-default';
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
            MatchesController.prototype.luckySpin = function () {
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    if (match.vosePredictor != null) {
                        match.predict();
                    }
                }
            };
            MatchesController.prototype.showLuckySpin = function () {
                var _this = this;
                var res = Object.keys(this.predictions).some(function (key) {
                    return _this.predictions[key].vosePredictor != null;
                });
                return this.luckySpinEnabled || res;
            };
            MatchesController.prototype.showSubmitButton = function () {
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    if (match.status == 'SCHEDULED' || match.status == 'TIMED') {
                        this.submitButtonEnabled = true;
                        break;
                    }
                }
                return this.submitButtonEnabled;
            };
            MatchesController.prototype.gotoMatchday = function () {
                this.$state.go('app.matches', {
                    league: this.leagueSlug,
                    season: this.seasonSlug,
                    round: this.matchday
                });
            };
            MatchesController.prototype.restoreState = function () {
                var cached = this.cache.get(this.stateKey);
                if (!cached) {
                    return;
                }
                this.predictions = cached.predictions;
                console.log(this.predictions);
            };
            MatchesController.prototype.onDestroy = function () {
                var _this = this;
                this.$scope.$on('$destroy', function () {
                    var state = {
                        predictions: _this.predictions,
                        league: _this.leagueSlug,
                        season: _this.seasonSlug,
                        round: _this.matchday
                    };
                    _this.cache.put(_this.stateKey, state);
                });
            };
            MatchesController.prototype.jokerChange = function (fixture) {
                var _this = this;
                this.predictionService.pickJoker(fixture).then(function (data) {
                    angular.forEach(_this.fixtures, function (value, key) {
                        if (fixture != value) {
                            value.prediction.hasJoker = false;
                        }
                    });
                }).catch(function () {
                    fixture.prediction.hasJoker = false;
                    console.log('bad');
                });
            };
            return MatchesController;
        }());
        MatchesController.$inject = ['$q', '$state', '$stateParams', '$scope', 'matches', 'season', 'logger',
            'predictionService', 'vosePredictorFactory', 'cache'];
        matches.MatchesController = MatchesController;
        angular
            .module('app.matches')
            .controller('MatchesController', MatchesController);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.controller.js.map