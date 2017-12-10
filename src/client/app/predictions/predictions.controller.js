var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        var PredictionsController = (function () {
            function PredictionsController($q, $window, storage, logger, leagueSeasonFactory, fixturePredictionService, EntitySet, Fixture, sort) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this.logger = logger;
                this.leagueSeasonFactory = leagueSeasonFactory;
                this.fixturePredictionService = fixturePredictionService;
                this.EntitySet = EntitySet;
                this.Fixture = Fixture;
                this.sort = sort;
                this.title = 'Predictions';
                this.paging = {
                    currentPage: 1,
                    maxPagesToShow: 5,
                    pageSize: 10,
                    pageCount: 0
                };
                this.summary = {
                    points: 0,
                    goalDiff: 0,
                    pointsExcJoker: 0,
                    goalDiffExcJoker: 0,
                    matches: 0,
                    correctOutcome: 0
                };
                this.activate();
            }
            PredictionsController.prototype.activate = function () {
                var _this = this;
                this.init();
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.compressed = data;
                    _this.storage.setItem('compressed-fixtures', data.compressed);
                    var fixtures = _this.$window.lzwCompress.unpack(data.compressed);
                    _this.fixtureSet = new _this.EntitySet(_this.Fixture);
                    _this.fixtureSet.mapDtoListToContext(fixtures);
                    _this.pageChanged();
                    _this.fixtureCount = _this.fixtureSet.getCount();
                    _this.fixtureFilteredCount = _this.fixtureSet.getFilteredCount();
                    _this.summarize();
                });
            };
            PredictionsController.prototype.init = function () {
                var _this = this;
                Object.defineProperty(this.paging, 'showing', {
                    get: function () {
                        var paging = _this.paging, itemCount = _this.fixtureFilteredCount;
                        if (itemCount === 0) {
                            return "";
                        }
                        var resultStart = (paging.currentPage - 1) * paging.pageSize + 1;
                        var resultEnd = resultStart + paging.pageSize - 1;
                        if (resultEnd > itemCount) {
                            resultEnd = itemCount;
                        }
                        return "showing " + resultStart + " - " + resultEnd + " of " + (itemCount || 0);
                    }
                });
                var val = this.fixtureFilteredCount / this.paging.pageSize;
                var pageCount = Math.floor(val);
                if (!isNumber(val)) {
                    pageCount += 1;
                }
                this.paging.pageCount = pageCount;
                this.rounds = Array.apply(null, { length: 38 }).map(function (value, index) {
                    return {
                        id: index + 1,
                        name: index + 1
                    };
                });
            };
            PredictionsController.prototype.onRoundChanged = function () {
                console.log(this.selectedRound);
            };
            PredictionsController.prototype.summarize = function () {
                var _this = this;
                var summary = {
                    points: 0,
                    goalDiff: 0,
                    pointsExcJoker: 0,
                    goalDiffExcJoker: 0,
                    matches: 0,
                    correctOutcome: 0
                };
                this.summary = this.fixtureSet.getAll().reduce(function (accum, fixture) {
                    var prediction = fixture.prediction;
                    if (prediction == null || prediction.points == null) {
                        return accum;
                    }
                    accum.points += prediction.points;
                    accum.goalDiff += prediction.goalDiff;
                    accum.pointsExcJoker += prediction.points;
                    accum.goalDiffExcJoker += prediction.goalDiff;
                    if (prediction.hasJoker && prediction.goalDiff >= 0 && prediction.points > 0) {
                        accum.points += prediction.points;
                        accum.goalDiff += prediction.goalDiff;
                    }
                    accum.matches += 1;
                    var result = fixture.result;
                    var choice = prediction.choice;
                    var choiceOutcome = _this.calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
                    var resultOutcome = _this.calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
                    if (choiceOutcome == resultOutcome) {
                        accum.correctOutcome += 1;
                    }
                    return accum;
                }, summary);
            };
            PredictionsController.prototype.pageChanged = function () {
                this.fixtures = this.fixtureSet.getAll({
                    sort: this.sort.sort_by('date'),
                    page: this.paging.currentPage,
                    size: this.paging.pageSize
                });
            };
            PredictionsController.prototype.calcOutcome = function (home, away) {
                if (home > away) {
                    return 'w';
                }
                if (home < away) {
                    return 'l';
                }
                if (home === away) {
                    return 'd';
                }
            };
            return PredictionsController;
        }());
        PredictionsController.$inject = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory',
            'fixturePredictionService', 'EntitySet', 'Fixture', 'sort'];
        predictions.PredictionsController = PredictionsController;
        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }
        angular
            .module('app.predictions')
            .controller('PredictionsController', PredictionsController);
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.controller.js.map