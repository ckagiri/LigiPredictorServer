var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = [];
        function factory() {
            var Season = (function () {
                function Season(rounds) {
                    angular.extend(this, rounds);
                }
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