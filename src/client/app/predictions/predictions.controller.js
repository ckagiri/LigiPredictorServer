var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        var PredictionsController = (function () {
            function PredictionsController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Predictions';
            }
            return PredictionsController;
        }());
        PredictionsController.$inject = ['$q', 'logger'];
        predictions.PredictionsController = PredictionsController;
        angular
            .module('app.predictions')
            .controller('PredictionsController', PredictionsController);
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.controller.js.map