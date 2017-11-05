var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        var PredictionsController = /** @class */ (function () {
            function PredictionsController($q, logger, fixturePredictionService) {
                this.$q = $q;
                this.logger = logger;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'Predictions';
                this.activate();
            }
            PredictionsController.prototype.activate = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.fixtures = data;
                });
            };
            PredictionsController.$inject = ['$q', 'logger', 'fixturePredictionService'];
            return PredictionsController;
        }());
        predictions.PredictionsController = PredictionsController;
        angular
            .module('app.predictions')
            .controller('PredictionsController', PredictionsController);
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.controller.js.map