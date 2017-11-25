var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Team = (function () {
                function Team(data) {
                    this.points = 0;
                    angular.extend(this, data);
                }
                Team.prototype.getPoints = function () {
                    return this.points;
                };
                Team.prototype.resetPoints = function () {
                    this.points = 0;
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