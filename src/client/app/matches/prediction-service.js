var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var PredictionService = (function () {
            function PredictionService($http, $q, exception, logger) {
                var _this = this;
                this.$http = $http;
                this.$q = $q;
                this.exception = exception;
                this.logger = logger;
                this.submitPredictions = function (req) {
                    return _this.$http.post('/api/predictions', req)
                        .then(_this.success)
                        .catch(_this.fail);
                };
                this.pickJoker = function (fixture) {
                    return _this.$http.post('/api/predictions/pick-joker', fixture)
                        .then(_this.success)
                        .catch(_this.fail);
                };
                this.success = function (response) { return response.data; };
                this.fail = function (error) {
                    var msg = (error.data && error.data.description) || 'Something bad happened';
                    var reason = 'request failed.';
                    _this.exception.catcher(msg)(reason);
                    return _this.$q.reject(msg);
                };
            }
            PredictionService.prototype.fetchLiveFixtures = function (league, season, round) {
                return this.$http.get('/api/fixtures/live');
            };
            PredictionService.prototype.fetchPendingPredictions = function (league, season, round) {
                return this.$http.get('/api/predictions/mine');
            };
            return PredictionService;
        }());
        PredictionService.$inject = ['$http', '$q', 'exception', 'logger'];
        core.PredictionService = PredictionService;
        angular
            .module('app.core')
            .service('predictionService', PredictionService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=prediction-service.js.map