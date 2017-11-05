var admin;
(function (admin) {
    var fixtures;
    (function (fixtures) {
        'use strict';
        var FixtureDetailController = /** @class */ (function () {
            function FixtureDetailController($q, fixture, logger) {
                this.$q = $q;
                this.fixture = fixture;
                this.logger = logger;
                this.title = 'Fixture';
            }
            FixtureDetailController.$inject = ['$q', 'fixture', 'logger'];
            return FixtureDetailController;
        }());
        fixtures.FixtureDetailController = FixtureDetailController;
        angular
            .module('admin.fixtures')
            .controller('FixtureDetailController', FixtureDetailController);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=fixture-detail.controller.js.map