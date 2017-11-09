var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var FixturePredictionService = (function () {
            function FixturePredictionService($http, $q, exception, logger) {
                var _this = this;
                this.$http = $http;
                this.$q = $q;
                this.exception = exception;
                this.logger = logger;
                this.getFixturesWithPredictions = function () {
                    return _this.$http.get('/api/matches/predictions')
                        .then(_this.success)
                        .catch(_this.fail);
                };
                this.success = function (response) { return response.data; };
                this.fail = function (error) {
                    var msg = error.data.description;
                    var reason = 'query for people failed.';
                    _this.exception.catcher(msg)(reason);
                    return _this.$q.reject(msg);
                };
            }
            return FixturePredictionService;
        }());
        FixturePredictionService.$inject = ['$http', '$q', 'exception', 'logger'];
        core.FixturePredictionService = FixturePredictionService;
        angular
            .module('app.core')
            .service('fixturePredictionService', FixturePredictionService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=fixture-prediction.service.js.map