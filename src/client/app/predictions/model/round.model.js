var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = [];
        function factory() {
            var Round = (function () {
                function Round(fixtures) {
                    angular.extend(this, fixtures);
                }
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