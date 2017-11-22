var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Match = (function () {
                function Match(data) {
                    this.homeScore = 0;
                    this.awayScore = 0;
                    this.assigned = false;
                    angular.extend(this, data);
                }
                Match.prototype.assign = function () { };
                Match.prototype.setScore = function () { };
                Match.prototype.getHomeTeam = function () { };
                Match.prototype.getAwayTeam = function () { };
                Match.prototype.getHomeScore = function () { };
                Match.prototype.getAwayScore = function () { };
                return Match;
            }());
            return Match;
        }
        angular
            .module('app.core')
            .factory('Match', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=match.model.js.map