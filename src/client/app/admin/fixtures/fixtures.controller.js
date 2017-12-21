var admin;
(function (admin) {
    var fixtures;
    (function (fixtures_1) {
        'use strict';
        var FixturesController = (function () {
            function FixturesController($q, fixtures, logger, Modal) {
                this.$q = $q;
                this.fixtures = fixtures;
                this.logger = logger;
                this.Modal = Modal;
                this.title = 'Fixtures';
            }
            FixturesController.prototype.editOdds = function (fixture) {
                var _this = this;
                var modalInstance = this.Modal({
                    templateUrl: 'app/admin/fixtures/edit-odds-modal.html',
                    controller: 'EditOddsController',
                    controllerAs: 'vm',
                    size: 'sm',
                    model: fixture,
                });
                modalInstance.then(function (data) {
                    var match = _this.fixtures.filter(function (n) { return n.id() == data._id; })[0];
                    angular.extend(match, data);
                    console.log(match);
                    //findone and update
                });
            };
            return FixturesController;
        }());
        FixturesController.$inject = ['$q', 'fixtures', 'logger', 'Modal'];
        fixtures_1.FixturesController = FixturesController;
        angular
            .module('admin.fixtures')
            .controller('FixturesController', FixturesController);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=fixtures.controller.js.map