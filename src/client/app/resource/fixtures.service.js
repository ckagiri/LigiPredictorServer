var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        FixturesResource.$inject = ['resource'];
        function FixturesResource(resource) {
            var Leagues = resource("leagues");
            var Fixtures = resource("fixtures");
            Fixtures.forRound = function (leagueId, seasonId, roundId) {
                return Leagues.getList('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures', { leagueId: leagueId, seasonId: seasonId, roundId: roundId });
            };
            Fixtures.forTeam = function (leagueId, seasonId, teamId) {
                return Leagues.getList('/:leagueId/seasons/:seasonId/teams/:teamId/fixtures', { leagueId: leagueId, seasonId: seasonId, teamId: teamId });
            };
            Fixtures.getOne = function (leagueId, seasonId, roundId, fixtureId) {
                return Leagues.getOne('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures/:fixtureId', { leagueId: leagueId, seasonId: seasonId, roundId: roundId, fixtureId: fixtureId });
            };
            return Fixtures;
        }
        angular
            .module('app.core')
            .factory('FixturesResource', FixturesResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=fixtures.service.js.map