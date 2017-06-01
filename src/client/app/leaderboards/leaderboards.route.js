var app;
(function (app) {
    var leaderboards;
    (function (leaderboards) {
        'use strict';
        angular
            .module('app.leaderboards')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.leaderboards',
                    config: {
                        url: '/leaderboards',
                        templateUrl: 'app/leaderboards/leaderboards.html',
                        controller: 'LeaderboardsController',
                        controllerAs: 'vm',
                        title: 'leaderboards'
                    }
                }
            ];
        }
    })(leaderboards = app.leaderboards || (app.leaderboards = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.route.js.map