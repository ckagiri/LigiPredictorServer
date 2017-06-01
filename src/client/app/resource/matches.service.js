var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        MatchesResource.$inject = ['resource'];
        function MatchesResource(resource) {
            var Matches = resource("matches");
            Matches.default = function () {
                return Matches.all();
            };
            Matches.forRound = function (league, season, round) {
                return Matches.getList('?league=:league&season=:season&round=:round', {
                    league: league, season: season, round: round
                });
            };
            return Matches;
        }
        angular
            .module('app.core')
            .factory('MatchesResource', MatchesResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.service.js.map