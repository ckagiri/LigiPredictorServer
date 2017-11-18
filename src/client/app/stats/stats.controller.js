var app;
(function (app) {
    var stats;
    (function (stats) {
        'use strict';
        var StatsController = (function () {
            function StatsController($q, $window, storage, _, logger, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this._ = _;
                this.logger = logger;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'Stats';
                this.COLORS = ['#E33030', '#DB9A9A'];
                this.BAR_CHART_OPTIONS = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 450,
                        x: function (d) { return d.label; },
                        y: function (d) { return d.value; },
                        showValues: true,
                        duration: 500,
                        xAxis: {
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: 'Values'
                        },
                        color: this.COLORS
                    }
                };
                this.allMatchOutcomes = { loading: true };
                this.activate();
            }
            StatsController.prototype.activate = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.compressed = data;
                    //this.storage.setItem('compressed-fixtures', data.compressed);
                    _this.fixtures = _this.$window.lzwCompress.unpack(data.compressed);
                    _this.allMatchOutcomes.options = _this.BAR_CHART_OPTIONS;
                    _this.allMatchOutcomes.loading = false;
                    _this.allMatchOutcomes.err = null;
                    _this.allMatchOutcomes.data = [
                        {
                            "key": "Series1",
                            "color": "#d62728",
                            "values": [
                                {
                                    "label": "Group A",
                                    "value": 1.8746444827653
                                },
                                {
                                    "label": "Group B",
                                    "value": 8.0961543492239
                                },
                                {
                                    "label": "Group C",
                                    "value": 0.57072943117674
                                },
                                {
                                    "label": "Group D",
                                    "value": 2.4174010336624
                                },
                                {
                                    "label": "Group E",
                                    "value": 0.72009071426284
                                },
                                {
                                    "label": "Group F",
                                    "value": 0.77154485523777
                                },
                                {
                                    "label": "Group G",
                                    "value": 0.90152097798131
                                },
                                {
                                    "label": "Group H",
                                    "value": 0.91445417330854
                                },
                                {
                                    "label": "Group I",
                                    "value": 0.055746319141851
                                }
                            ]
                        },
                        {
                            "key": "Series2",
                            "color": "#1f77b4",
                            "values": [
                                {
                                    "label": "Group A",
                                    "value": 25.307646510375
                                },
                                {
                                    "label": "Group B",
                                    "value": 16.756779544553
                                },
                                {
                                    "label": "Group C",
                                    "value": 18.451534877007
                                },
                                {
                                    "label": "Group D",
                                    "value": 8.6142352811805
                                },
                                {
                                    "label": "Group E",
                                    "value": 7.8082472075876
                                },
                                {
                                    "label": "Group F",
                                    "value": 5.259101026956
                                },
                                {
                                    "label": "Group G",
                                    "value": 0.30947953487127
                                },
                                {
                                    "label": "Group H",
                                    "value": 0
                                },
                                {
                                    "label": "Group I",
                                    "value": 0
                                }
                            ]
                        }
                    ];
                });
            };
            return StatsController;
        }());
        StatsController.$inject = ['$q', '$window', '_', 'localstorage', 'logger', 'fixturePredictionService'];
        stats.StatsController = StatsController;
        angular
            .module('app.stats')
            .controller('StatsController', StatsController);
    })(stats = app.stats || (app.stats = {}));
})(app || (app = {}));
//# sourceMappingURL=stats.controller.js.map