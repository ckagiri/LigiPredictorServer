var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = [];
        function factory() {
            var Fixture = (function () {
                function Fixture(data) {
                    this.homeScore = 0;
                    this.awayScore = 0;
                    this.assigned = false;
                    angular.extend(this, data);
                }
                Fixture.prototype.assign = function () { };
                Fixture.prototype.setScore = function () { };
                Fixture.prototype.getHomeTeam = function () { };
                Fixture.prototype.getAwayTeam = function () { };
                Fixture.prototype.getHomeScore = function () { };
                Fixture.prototype.getAwayScore = function () { };
                return Fixture;
            }());
            return Fixture;
        }
        angular
            .module('app.core')
            .factory('Fixture', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=fixture.model.js.map