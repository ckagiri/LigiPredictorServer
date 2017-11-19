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
                            "key": "Correct",
                            "values": [
                                {
                                    "label": "Arsenal",
                                    "value": 40.5
                                },
                                {
                                    "label": "Liverpool",
                                    "value": 55.5
                                }
                            ]
                        },
                        {
                            "key": "Incorrect",
                            "values": [
                                {
                                    "label": "Arsenal",
                                    "value": 59.5
                                },
                                {
                                    "label": "Liverpool",
                                    "value": 44.5
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