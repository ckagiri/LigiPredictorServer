var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        var PredictionsController = (function () {
            function PredictionsController($q, $window, storage, logger, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.storage = storage;
                this.logger = logger;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'Predictions';
                this.activate();
            }
            PredictionsController.prototype.activate = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.compressed = data;
                    _this.storage.setItem('compressed-fixtures', data.compressed);
                    _this.fixtures = _this.$window.lzwCompress.unpack(data.compressed);
                });
            };
            return PredictionsController;
        }());
        PredictionsController.$inject = ['$q', '$window', 'localstorage', 'logger', 'fixturePredictionService'];
        predictions.PredictionsController = PredictionsController;
        angular
            .module('app.predictions')
            .controller('PredictionsController', PredictionsController);
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.controller.js.map