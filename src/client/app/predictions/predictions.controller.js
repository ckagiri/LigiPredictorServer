var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        var PredictionsController = (function () {
            function PredictionsController($q, $window, storage, logger, leagueSeasonFactory, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this.logger = logger;
                this.leagueSeasonFactory = leagueSeasonFactory;
                this.fixturePredictionService = fixturePredictionService;
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
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.compressed = data;
                    _this.storage.setItem('compressed-fixtures', data.compressed);
                    _this.fixtures = _this.$window.lzwCompress.unpack(data.compressed);
                    _this.leagueSeasonFactory.createLeagueSeason(_this.fixtures);
                });
            };
            PredictionsController.prototype.init = function () {
                Object.defineProperty(this.paging, 'showing', {
                    get: function () {
                        var paging = this.paging, itemCount = this.fixtureFilteredCount;
                        if (itemCount === 0) {
                            return "";
                        }
                        var resultStart = (paging.currentPage - 1) * paging.pageSize + 1;
                        var resultEnd = resultStart + paging.pageSize - 1;
                        if (resultEnd > itemCount) {
                            resultEnd = itemCount;
                        }
                        return "showing " + resultStart + " - " + resultEnd + " of " + itemCount;
                    }
                });
            };
            PredictionsController.prototype.pageChanged = function () {
            };
            return PredictionsController;
        }());
        PredictionsController.$inject = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory', 'fixturePredictionService'];
        predictions.PredictionsController = PredictionsController;
        angular
            .module('app.predictions')
            .controller('PredictionsController', PredictionsController);
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.controller.js.map