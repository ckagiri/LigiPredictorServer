var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        var MatchesController = (function () {
            function MatchesController($q, $state, $stateParams, $scope, $window, fixtures, season, logger, predictionService, vosePredictorFactory, cache) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$stateParams = $stateParams;
                this.$scope = $scope;
                this.$window = $window;
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
                this.jokerChosen = "";
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.updateTimeout = null;
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
                        console.log(errorResponse);
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
                this.restoreState();
                this.refresh();
                this.onDestroy();
            }
            MatchesController.prototype.refresh = function () {
                var _this = this;
                var hasOneAvailableFixture = false;
                var _loop_1 = function (match) {
                    var choice = match.prediction.choice || {};
                    if (match.status == 'SCHEDULED' || match.status == 'TIMED') {
                        hasOneAvailableFixture = true;
                        if (choice.isComputerGenerated || choice.isComputerGenerated == null) {
                            match['vosePredictor'] = this_1.vosePredictorFactory.createPredictor(match.odds);
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
                        if (match.prediction.hasJoker) {
                            this_1.jokerChosen = "chosen";
                        }
                    }
                    this_1.totalPoints += match.prediction.points || 0;
                    this_1.totalGoalDiff += match.prediction.goalDiff || 0;
                    if (match.prediction.hasJoker && match.prediction.goalDiff >= 0 && match.prediction.points > 0) {
                        this_1.totalPoints += match.prediction.points;
                        this_1.totalGoalDiff += match.prediction.goalDiff;
                        match.prediction.points *= 2;
                        match.prediction.goalDiff *= 2;
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var match = _a[_i];
                    _loop_1(match);
                }
                if (!hasOneAvailableFixture) {
                    this.jokerChosen = "chosen";
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
            MatchesController.prototype.live = function () {
                var _this = this;
                var league = this.leagueSlug;
                var season = this.seasonSlug;
                var round = this.matchday;
                if (this.updateTimeout == null) {
                    return this.scheduleNextUpdate();
                }
                if (this.hasLiveFixtures()) {
                    this.predictionService.fetchLiveFixtures(league, season, round)
                        .then(function (fixtures) {
                        _this.updateFixtures(fixtures);
                        if (_this.hasPendingPredictions()) {
                            _this.predictionService.fetchPendingPredictions(league, season, round)
                                .then(function (predictions) {
                                _this.updatePredictions(predictions);
                                return _this.scheduleNextUpdate();
                            });
                        }
                        else {
                            return _this.scheduleNextUpdate();
                        }
                    });
                }
                else if (this.hasPendingPredictions()) {
                    this.predictionService.fetchPendingPredictions(league, season, round)
                        .then(function (predictions) {
                        _this.updatePredictions(predictions);
                        return _this.scheduleNextUpdate();
                    });
                }
                else {
                    clearTimeout(this.updateTimeout);
                }
            };
            MatchesController.prototype.hasLiveFixtures = function () {
                return this.$window._.some(this.fixtures, 'status', 'IN_PLAY');
            };
            MatchesController.prototype.hasPendingPredictions = function () {
                return this.$window._.some(this.fixtures, function (fixture) {
                    return fixture.status = 'FINISHED' && fixture.prediction.status == 'PENDING';
                });
            };
            MatchesController.prototype.updateFixtures = function (fixtures) {
                for (var _i = 0, fixtures_1 = fixtures; _i < fixtures_1.length; _i++) {
                    var fixture = fixtures_1[_i];
                    for (var _a = 0, _b = this.fixtures; _a < _b.length; _a++) {
                        var match = _b[_a];
                        if (fixture._id == match._id) {
                            angular.extend(match, fixture);
                            break;
                        }
                    }
                }
            };
            MatchesController.prototype.updatePredictions = function (predictions) {
                for (var _i = 0, predictions_2 = predictions; _i < predictions_2.length; _i++) {
                    var prediction = predictions_2[_i];
                    for (var _a = 0, _b = this.fixtures; _a < _b.length; _a++) {
                        var match = _b[_a];
                        if (prediction._id == match.prediction_id) {
                            angular.extend(match.prediction, prediction);
                            break;
                        }
                    }
                }
            };
            MatchesController.prototype.scheduleNextUpdate = function () {
                var _this = this;
                clearTimeout(this.updateTimeout);
                var date = this.calculateNextUpdate();
                var now = this.$window.Moment();
                var ms = date - now;
                this.updateTimeout = setTimeout(function () { return _this.live(); }, ms);
                console.log("Live Update scheduled for " + date.format() + " - that's in " + ms + "ms");
            };
            MatchesController.prototype.calculateNextUpdate = function () {
                var fixtureLive = false;
                var hasPendingPrediction = false;
                var Moment = this.$window.Moment;
                var now = Moment();
                var next = Moment().add(1, 'year');
                for (var _i = 0, _a = this.fixtures; _i < _a.length; _i++) {
                    var fixture = _a[_i];
                    if (fixture.status == 'FINISHED') {
                        hasPendingPrediction = true;
                    }
                    else if (fixture.status == "IN_PLAY") {
                        fixtureLive = true;
                    }
                    else if (fixture.status == "SCHEDULED" || fixture.status == "TIMED") {
                        // Parse fixture start date/time
                        var fixtureStart = Moment(fixture.date);
                        if (fixtureStart > now && fixtureStart < next) {
                            next = fixtureStart;
                        }
                    }
                }
                var tomorrow = Moment().add(1, 'day');
                var update = next;
                if (fixtureLive || hasPendingPrediction) {
                    update = Moment().add(5, 'minutes');
                }
                else if (next > tomorrow) {
                    update = Moment().add(12, 'hours');
                }
                return update;
            };
            return MatchesController;
        }());
        MatchesController.$inject = ['$q', '$state', '$stateParams', '$scope', '$window', 'matches', 'season', 'logger',
            'predictionService', 'vosePredictorFactory', 'cache'];
        matches.MatchesController = MatchesController;
        angular
            .module('app.matches')
            .controller('MatchesController', MatchesController);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.controller.js.map