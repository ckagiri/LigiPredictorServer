var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        angular
            .module('app.matches')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.matches',
                    config: {
                        url: '/matches?league&season&round',
                        templateUrl: 'app/matches/matches.html',
                        controller: 'MatchesController',
                        controllerAs: 'vm',
                        title: 'matches',
                        resolve: {
                            season: ['$stateParams', 'SeasonsResource',
                                function ($stateParams, Seasons) {
                                    var league = $stateParams.league, season = $stateParams.season;
                                    if (league != null && season != null) {
                                        return Seasons.getOne(league, season);
                                    }
                                    return Seasons.default();
                                }],
                            matches: ['$stateParams', 'MatchesResource',
                                function ($stateParams, Matches) {
                                    var league = $stateParams.league, season = $stateParams.season, round = $stateParams.round;
                                    if (league != null && season != null && round != null) {
                                        return Matches.forRound(league, season, round);
                                    }
                                    return Matches.default();
                                }]
                        }
                    }
                }
            ];
        }
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.route.js.map