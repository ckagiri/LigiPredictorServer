var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        LeaguesResource.$inject = ['resource'];
        function LeaguesResource(resource) {
            var Leagues = resource("leagues");
            return Leagues;
        }
        angular
            .module('app.core')
            .factory('LeaguesResource', LeaguesResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=leagues.service.js.map