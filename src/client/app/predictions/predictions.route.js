var app;
(function (app) {
    var predictions;
    (function (predictions) {
        'use strict';
        angular
            .module('app.predictions')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.predictions',
                    config: {
                        url: '/predictions',
                        templateUrl: 'app/predictions/predictions.html',
                        controller: 'PredictionsController',
                        controllerAs: 'vm',
                        title: 'predictions'
                    }
                }
            ];
        }
    })(predictions = app.predictions || (app.predictions = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions.route.js.map