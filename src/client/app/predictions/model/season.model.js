var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Season = (function () {
                function Season(rounds) {
                    angular.extend(this, rounds);
                }
                Season.prototype.getTeams = function () {
                };
                Season.prototype.setTeams = function () {
                };
                Season.prototype.sortStandings = function () {
                };
                Season.prototype.assign = function () {
                };
                return Season;
            }());
            return Season;
        }
        angular
            .module('app.core')
            .factory('Season', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=season.model.js.map