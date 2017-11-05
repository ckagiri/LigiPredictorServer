var admin;
(function (admin) {
    var fixtures;
    (function (fixtures_1) {
        'use strict';
        var FixturesController = /** @class */ (function () {
            function FixturesController($q, fixtures, logger) {
                this.$q = $q;
                this.fixtures = fixtures;
                this.logger = logger;
                this.title = 'Fixtures';
            }
            FixturesController.$inject = ['$q', 'fixtures', 'logger'];
            return FixturesController;
        }());
        fixtures_1.FixturesController = FixturesController;
        angular
            .module('admin.fixtures')
            .controller('FixturesController', FixturesController);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=fixtures.controller.js.map