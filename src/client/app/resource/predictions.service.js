var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        PredictionsResource.$inject = ['resource'];
        function PredictionsResource(resource) {
            var Predictions = resource("predictions");
            return Predictions;
        }
        angular
            .module('app.core')
            .factory('PredictionsResource', PredictionsResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.service.js.map