var admin;
(function (admin) {
    var leagues;
    (function (leagues) {
        'use strict';
        angular
            .module('admin.leagues')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'admin.leagues',
                    config: {
                        url: '/leagues',
                        templateUrl: 'app/admin/leagues/leagues.html',
                        controller: 'LeaguesController',
                        controllerAs: 'vm',
                        title: 'leagues',
                        resolve: {
                            leagues: ['LeaguesResource', function (Leagues) {
                                    return Leagues.all();
                                }]
                        }
                    }
                },
                {
                    state: 'admin.league-detail',
                    config: {
                        url: '/leagues/:leagueId',
                        templateUrl: 'app/admin/leagues/league-detail.html',
                        controller: 'LeagueDetailController',
                        controllerAs: 'vm',
                        title: 'League',
                        resolve: {
                            league: ['$stateParams', 'LeaguesResource',
                                function ($stateParams, Leagues) {
                                    return Leagues.getById($stateParams.leagueId);
                                }]
                        }
                    }
                }
            ];
        }
    })(leagues = admin.leagues || (admin.leagues = {}));
})(admin || (admin = {}));
//# sourceMappingURL=leagues.route.js.map