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
                this.makePredictions = function () {
                    // Object.keys(this.predictions).forEach((key: any) => {
                    // 	if(this.predictions[key].vosePredictor != null) {
                    // 		delete this.predictions[key].vosePredictor;
                    // 	}
                    // }) 
                    var request = {};
                    request.predictions = _this.predictions;
                    request.joker = _this.predictions;
                    _this.predictionService.submitPredictions(request)
                        .then(function (data) {
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
                this.init();
            }
            MatchesController.prototype.init = function () {
                var _this = this;
                var _loop_1 = function (match) {
                    var choice = match.prediction.choice || {};
                    if (match.status == 'SCHEDULED' || match.status == 'TIMED') {
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
                };
                var this_1 = this;
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    _loop_1(match);
                }
            };
            MatchesController.prototype.pointsClass = function (points) {
                return 'label-success';
            };
            ;
            MatchesController.prototype.diffClass = function (diff) {
                if (diff > -1) {
                    return 'label-success';
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
            MatchesController.prototype.luckySpin = function () {
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    if (match.predict != null) {
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
            return MatchesController;
        }());
        MatchesController.$inject = ['$q', '$state', '$stateParams', '$scope', 'matches', 'season', 'logger',
            'PredictionsResource', 'vosePredictorFactory', 'cache'];
        matches.MatchesController = MatchesController;
        angular
            .module('app.matches')
            .controller('MatchesController', MatchesController);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.controller.js.map