var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Fixture = (function () {
                function Fixture(data) {
                    angular.extend(this, data);
                }
                return Fixture;
            }());
            Fixture.key = '_id';
            return Fixture;
        }
        angular
            .module('app.core')
            .factory('Fixture', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=fixture.model.js.map