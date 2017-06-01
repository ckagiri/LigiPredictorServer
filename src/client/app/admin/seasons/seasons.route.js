var admin;
(function (admin) {
    var seasons;
    (function (seasons) {
        'use strict';
        angular
            .module('admin.seasons')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'admin.seasons',
                    config: {
                        url: '/leagues/:leagueId/seasons',
                        templateUrl: 'app/admin/seasons/seasons.html',
                        controller: 'SeasonsController',
                        controllerAs: 'vm',
                        title: 'seasons',
                        resolve: {
                            seasons: ['$stateParams', 'SeasonsResource',
                                function ($stateParams, Seasons) {
                                    return Seasons.forLeague($stateParams.leagueId);
                                }]
                        }
                    }
                },
                ,
                {
                    state: 'admin.season-detail',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId',
                        templateUrl: 'app/admin/seasons/season-detail.html',
                        controller: 'SeasonDetailController',
                        controllerAs: 'vm',
                        title: 'Season',
                        resolve: {
                            season: ['$stateParams', 'SeasonsResource',
                                function ($stateParams, Seasons) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId;
                                    return Seasons.getOne(leagueId, seasonId);
                                }]
                        }
                    }
                },
                {
                    state: 'admin.season-fixtures',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/fixtures?round',
                        templateUrl: 'app/admin/fixtures/fixtures.html',
                        controller: 'FixturesController',
                        controllerAs: 'vm',
                        title: 'season-Fixtures',
                        resolve: {
                            fixtures: ['$stateParams', 'FixturesResource',
                                function ($stateParams, Fixtures) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId, round = $stateParams.round;
                                    return Fixtures.forRound(leagueId, seasonId, round);
                                }]
                        }
                    }
                },
                {
                    state: 'admin.season-rounds',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/rounds',
                        templateUrl: 'app/admin/seasons/season-rounds.html',
                        controller: 'SeasonRoundsController',
                        controllerAs: 'vm',
                        title: 'season-Rounds',
                        resolve: {
                            rounds: ['$stateParams', 'RoundsResource',
                                function ($stateParams, Rounds) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId;
                                    return Rounds.forSeason(leagueId, seasonId);
                                }]
                        }
                    }
                },
                {
                    state: 'admin.season-round-fixtures',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures',
                        templateUrl: 'app/admin/fixtures/fixtures.html',
                        controller: 'FixturesController',
                        controllerAs: 'vm',
                        title: 'season-Fixtures',
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
                    state: 'admin.season-teams',
                    config: {
                        url: '/leagues/:leagueId/seasons/:seasonId/teams',
                        templateUrl: 'app/admin/seasons/season-teams.html',
                        controller: 'SeasonTeamsController',
                        controllerAs: 'vm',
                        title: 'season-Teams',
                        resolve: {
                            teams: ['$stateParams', 'TeamsResource',
                                function ($stateParams, Teams) {
                                    var leagueId = $stateParams.leagueId, seasonId = $stateParams.seasonId;
                                    return Teams.forSeason(leagueId, seasonId);
                                }]
                        }
                    }
                }
            ];
        }
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=seasons.route.js.map