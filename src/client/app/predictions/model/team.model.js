var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Team = (function () {
                function Team(data) {
                    angular.extend(this, data);
                }
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