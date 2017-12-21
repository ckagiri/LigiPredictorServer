var admin;
(function (admin) {
    var fixtures;
    (function (fixtures) {
        'use strict';
        var EditOddsController = (function () {
            function EditOddsController($q, logger, $rootScope, $scope, $uibModalInstance, $window, FixturesResource) {
                this.$q = $q;
                this.logger = logger;
                this.$rootScope = $rootScope;
                this.$scope = $scope;
                this.$uibModalInstance = $uibModalInstance;
                this.$window = $window;
                this.FixturesResource = FixturesResource;
                this.title = 'Fixtures';
                var copy = angular.copy($scope.model);
                this.fixture = FixturesResource.newInstance(copy);
                this.fixture.odds = this.fixture.odds || {};
            }
            EditOddsController.prototype.editOdds = function () {
                var _this = this;
                this.$scope.setProcessing();
                this.fixture.save(this.fixture).then(function (result) {
                    _this.$scope.setFinished();
                    _this.logger.success('Saved data', result);
                    _this.$uibModalInstance.close(result);
                    _this.$rootScope.$broadcast('oddsUpdated', result);
                });
            };
            EditOddsController.prototype.cancel = function () {
                this.$uibModalInstance.dismiss();
            };
            return EditOddsController;
        }());
        EditOddsController.$inject = ['$q', 'logger', '$rootScope', '$scope', '$uibModalInstance', '$window', 'FixturesResource'];
        fixtures.EditOddsController = EditOddsController;
        angular
            .module('admin.fixtures')
            .controller('EditOddsController', EditOddsController);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=edit-odds.controller.js.map