var admin;
(function (admin) {
    var fixtures;
    (function (fixtures) {
        'use strict';
        var FixtureDetailController = (function () {
            function FixtureDetailController($q, fixture, logger) {
                this.$q = $q;
                this.fixture = fixture;
                this.logger = logger;
                this.title = 'Fixture';
            }
            return FixtureDetailController;
        }());
        FixtureDetailController.$inject = ['$q', 'fixture', 'logger'];
        fixtures.FixtureDetailController = FixtureDetailController;
        angular
            .module('admin.fixtures')
            .controller('FixtureDetailController', FixtureDetailController);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=fixture-detail.controller.js.map