var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var League = (function () {
                function League() {
                }
                return League;
            }());
            return League;
        }
        angular
            .module('app.core')
            .factory('League', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=league.model.js.map