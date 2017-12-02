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
                    pageSize: 10
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
                Object.defineProperty(this.paging, 'pageCount', {
                    get: function () {
                        var val = _this.fixtureFilteredCount / _this.paging.pageSize;
                        var pageCount = Math.floor(val);
                        if (!isNumber(val)) {
                            pageCount += 1;
                        }
                        return pageCount;
                    }
                });
            };
            PredictionsController.prototype.pageChanged = function () {
                this.fixtures = this.fixtureSet.getAll({
                    sort: this.sort.sort_by('date'),
                    page: this.paging.currentPage,
                    size: this.paging.pageSize
                });
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