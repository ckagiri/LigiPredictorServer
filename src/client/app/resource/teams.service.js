var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        TeamsResource.$inject = ['resource'];
        function TeamsResource(resource) {
            var Leagues = resource("leagues");
            var Teams = resource("teams");
            Teams.forSeason = function (leagueId, seasonId) {
                return Leagues.getList('/:leagueId/seasons/:seasonId/teams', { leagueId: leagueId, seasonId: seasonId });
            };
            return Teams;
        }
        angular
            .module('app.core')
            .factory('TeamsResource', TeamsResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=teams.service.js.map