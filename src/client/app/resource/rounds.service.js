var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        RoundsResource.$inject = ['resource'];
        function RoundsResource(resource) {
            var Leagues = resource("leagues");
            var Rounds = resource("rounds");
            Rounds.forSeason = function (leagueId, seasonId) {
                return Leagues.getList('/:leagueId/seasons/:seasonId/rounds', { leagueId: leagueId, seasonId: seasonId });
            };
            return Rounds;
        }
        angular
            .module('app.core')
            .factory('RoundsResource', RoundsResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=rounds.service.js.map