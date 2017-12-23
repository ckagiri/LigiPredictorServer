var app;
(function (app) {
    var stats;
    (function (stats) {
        'use strict';
        var StatsController = (function () {
            function StatsController($q, $window, storage, logger, leagueSeasonFactory, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this.logger = logger;
                this.leagueSeasonFactory = leagueSeasonFactory;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'Stats';
                this.COLORS = ['#1f77b4', '#d62728'];
                this.BAR_CHART_OPTIONS = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 250,
                        x: function (d) { return d.label; },
                        y: function (d) { return d.value; },
                        showValues: true,
                        showControls: false,
                        duration: 500,
                        xAxis: {
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: 'Values'
                        }
                    }
                };
                this.allMatchOutcome = {};
                this.matchOutcomeInTeamMatches = {};
                this.SERVER_REFRESHED = false;
                this.activate();
            }
            StatsController.prototype.activate = function () {
                var compressed = this.storage.getItem('compressed-fixtures');
                if (compressed != null) {
                    this.localRefresh(compressed);
                }
                else {
                    this.serverRefresh();
                }
            };
            StatsController.prototype.serverRefresh = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    var compressed = data.compressed;
                    _this.storage.setItem('compressed-fixtures', compressed);
                    _this.SERVER_REFRESHED = true;
                    _this.localRefresh(compressed);
                });
            };
            StatsController.prototype.localRefresh = function (compressed) {
                this.fixtures = this.$window.lzwCompress.unpack(compressed);
                var closestMatchDate = this.leagueSeasonFactory.closestMatchDate(this.fixtures);
                var moment = this.$window.moment;
                var now = moment();
                var closestTime = moment(closestMatchDate);
                var diff = Math.abs(closestTime.diff(now, 'minutes'));
                if (diff < 60 && !this.SERVER_REFRESHED) {
                    this.serverRefresh();
                }
                this.loadAllMatchOutcomeChart();
                this.loadMatchOutcomeInTeamMatchesChart();
            };
            StatsController.prototype.loadAllMatchOutcomeChart = function () {
                var _this = this;
                var options = angular.copy(this.BAR_CHART_OPTIONS);
                var chart = options.chart;
                chart.barColor = ['#d62728', '#1f77b4'];
                chart.yAxis = {
                    axisLabel: 'Matches',
                    tickFormat: function (d) {
                        return _this.$window.d3.format('d')(d);
                    }
                };
                chart.valueFormat = function (d) {
                    return _this.$window.d3.format('d')(d);
                };
                this.allMatchOutcome.options = options;
                this.allMatchOutcome.data = [];
                var acc = { correct: 0, incorrect: 0 };
                this.fixtures.reduce(function (acc, fixture) {
                    var prediction = fixture.prediction;
                    if (prediction == null || prediction.points == null) {
                        return acc;
                    }
                    var result = fixture.result;
                    var choice = prediction.choice;
                    var choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
                    var resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
                    if (choiceOutcome == resultOutcome) {
                        acc['correct'] += 1;
                    }
                    else {
                        acc['incorrect'] += 1;
                    }
                    return acc;
                }, acc);
                var values = [];
                for (var key in acc) {
                    values.push({ label: key, value: acc[key] });
                }
                this.allMatchOutcome.data.push({ key: 'Match-Outcome', values: values });
            };
            StatsController.prototype.loadMatchOutcomeInTeamMatchesChart = function () {
                var _this = this;
                var options = angular.copy(this.BAR_CHART_OPTIONS);
                var chart = options.chart;
                chart.height = 650;
                chart.yAxis = {
                    axisLabel: 'Matches',
                    tickFormat: function (d) {
                        return _this.$window.d3.format('d')(d);
                    }
                };
                chart.valueFormat = function (d) {
                    return _this.$window.d3.format('d')(d);
                };
                chart.margin = { "left": 100 };
                this.matchOutcomeInTeamMatches.options = options;
                this.matchOutcomeInTeamMatches.data = [];
                var acc = { correct: {}, incorrect: {} };
                this.fixtures.reduce(function (acc, fixture) {
                    var prediction = fixture.prediction;
                    if (prediction == null || prediction.points == null) {
                        return acc;
                    }
                    var result = fixture.result;
                    var choice = prediction.choice;
                    var homeTeam = fixture.homeTeam.name;
                    var awayTeam = fixture.awayTeam.name;
                    acc['correct'][homeTeam] = acc['correct'][homeTeam] || 0;
                    acc['correct'][awayTeam] = acc['correct'][awayTeam] || 0;
                    acc['incorrect'][homeTeam] = acc['incorrect'][homeTeam] || 0;
                    acc['incorrect'][awayTeam] = acc['incorrect'][awayTeam] || 0;
                    var choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
                    var resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
                    if (choiceOutcome == resultOutcome) {
                        acc['correct'][homeTeam] += 1;
                        acc['correct'][awayTeam] += 1;
                    }
                    else {
                        acc['incorrect'][homeTeam] += 1;
                        acc['incorrect'][awayTeam] += 1;
                    }
                    return acc;
                }, acc);
                var chartData = [];
                for (var key in acc) {
                    var values = [];
                    for (var key1 in acc[key]) {
                        values.push({ label: key1, value: acc[key][key1] });
                    }
                    values.sort(function (a, b) {
                        return b.value - a.value;
                    });
                    chartData.push({ key: key, values: values });
                }
                chartData[1].color = "#d62728";
                chartData[0].color = "#1f77b4";
                this.matchOutcomeInTeamMatches.data = chartData;
            };
            return StatsController;
        }());
        StatsController.$inject = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory', 'fixturePredictionService'];
        stats.StatsController = StatsController;
        function calcOutcome(home, away) {
            if (home > away) {
                return 'w';
            }
            if (home < away) {
                return 'l';
            }
            if (home === away) {
                return 'd';
            }
        }
        angular
            .module('app.stats')
            .controller('StatsController', StatsController);
    })(stats = app.stats || (app.stats = {}));
})(app || (app = {}));
//# sourceMappingURL=stats.controller.js.map