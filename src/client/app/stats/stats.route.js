var app;
(function (app) {
    var stats;
    (function (stats) {
        'use strict';
        angular
            .module('app.stats')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.stats',
                    config: {
                        url: '/stats',
                        templateUrl: 'app/stats/stats.html',
                        controller: 'StatsController',
                        controllerAs: 'vm',
                        title: 'stats'
                    }
                }
            ];
        }
    })(stats = app.stats || (app.stats = {}));
})(app || (app = {}));
//# sourceMappingURL=stats.route.js.map