var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var PredictionsService = (function () {
            function PredictionsService() {
            }
            return PredictionsService;
        }());
        core.PredictionsService = PredictionsService;
        angular
            .module('app.core')
            .service('predictionsService', PredictionsService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.service.js.map