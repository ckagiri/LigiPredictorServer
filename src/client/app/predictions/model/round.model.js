var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Round = (function () {
                function Round(data) {
                    angular.extend(this, data);
                }
                Round.prototype.setMatches = function (matches) {
                    this.matches = matches;
                };
                Round.prototype.getMatches = function () {
                    return this.matches;
                };
                Round.prototype.assign = function () {
                    for (var i = 0; i < this.matches.length; i++) {
                        var match = this.matches[i];
                        match.assign();
                    }
                };
                return Round;
            }());
            return Round;
        }
        angular
            .module('app.core')
            .factory('Round', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=round.model.js.map