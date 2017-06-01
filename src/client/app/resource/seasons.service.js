var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        SeasonsResource.$inject = ['resource'];
        function SeasonsResource(resource) {
            var Leagues = resource("leagues");
            var Resource = resource("seasons");
            var Seasons = resource("seasons");
            Seasons.default = function () {
                return Resource.getOne('/default');
            };
            Seasons.forLeague = function (leagueId) {
                return Leagues.getList('/:leagueId/seasons', { leagueId: leagueId });
            };
            Seasons.getOne = function (leagueId, seasonId) {
                return Leagues.getOne('/:leagueId/seasons/:seasonId', { leagueId: leagueId, seasonId: seasonId });
            };
            return Seasons;
        }
        angular
            .module('app.core')
            .factory('SeasonsResource', SeasonsResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=seasons.service.js.map