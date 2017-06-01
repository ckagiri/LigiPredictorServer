var admin;
(function (admin) {
    var fixtures;
    (function (fixtures) {
        'use strict';
        angular
            .module('admin.fixtures')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'admin.fixtures',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures',
                        templateUrl: 'app/admin/fixtures/fixtures.html',
                        controller: 'FixturesController',
                        controllerAs: 'vm',
                        title: 'fixtures',
                        resolve: {
                            fixtures: ['$stateParams', 'FixturesResource',
                                function ($stateParams, Fixtures) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId, roundId = $stateParams.roundId;
                                    return Fixtures.forRound(leagueId, seasonId, roundId);
                                }]
                        }
                    }
                },
                {
                    state: 'admin.fixtures-alt',
                    config: {
                        url: '/fixtures?league&season&round',
                        templateUrl: 'app/admin/fixtures/fixtures.html',
                        controller: 'FixturesController',
                        controllerAs: 'vm',
                        title: 'fixtures',
                        resolve: {
                            fixtures: ['$stateParams', 'FixturesResource',
                                function ($stateParams, Fixtures) {
                                    var league = $stateParams.league, season = $stateParams.season, round = $stateParams.round;
                                    return Fixtures.forRound(league, season, round);
                                }]
                        }
                    }
                },
                {
                    state: 'admin.fixture-detail',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures/:fixtureId',
                        templateUrl: 'app/admin/fixtures/fixtures.html',
                        controller: 'FixturesController',
                        controllerAs: 'vm',
                        title: 'fixtures',
                        resolve: {
                            fixtures: ['$stateParams', 'FixturesResource',
                                function ($stateParams, Fixtures) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId, roundId = $stateParams.roundId, fixtureId = $stateParams.fixtureId;
                                    return Fixtures.getOne(leagueId, seasonId, roundId, fixtureId);
                                }]
                        }
                    }
                }
            ];
        }
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=fixtures.route.js.map