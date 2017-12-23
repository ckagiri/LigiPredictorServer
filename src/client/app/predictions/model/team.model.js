var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Team = (function () {
                function Team(data) {
                    this.played = 0;
                    this.points = 0;
                    this.goalsFor = 0;
                    this.goalsAgainst = 0;
                    angular.extend(this, data);
                }
                Team.prototype.getPoints = function () {
                    return this.points;
                };
                Team.prototype.getGoalsFor = function () {
                    return this.goalsFor;
                };
                Team.prototype.getGoalsAgainst = function () {
                    return this.goalsAgainst;
                };
                Team.prototype.getGoalDiff = function () {
                    return this.goalsFor - this.goalsAgainst;
                };
                Team.prototype.getPlayed = function () {
                    return this.played;
                };
                Team.prototype.resetPoints = function () {
                    this.points = 0;
                    this.goalsFor = 0;
                    this.goalsAgainst = 0;
                    this.played = 0;
                };
                Team.prototype.addPoints = function (p) {
                    this.points += p;
                };
                Team.prototype.getName = function () {
                    return this.name;
                };
                return Team;
            }());
            return Team;
        }
        angular
            .module('app.core')
            .factory('Team', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=team.model.js.map