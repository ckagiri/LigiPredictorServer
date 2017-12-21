namespace admin.fixtures {
	'use strict';

	export class EditOddsController {
		static $inject: string[] = ['$q', 'logger', '$rootScope', '$scope', '$uibModalInstance', '$window', 'FixturesResource'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger,
      private $rootScope: ng.IRootScopeService,
      private $scope: ng.IScope,
      private $uibModalInstance: any,
      private $window: ng.IWindowService,
      private FixturesResource: app.core.IFixturesResource) {
        let copy = angular.copy($scope.model);
        this.fixture = FixturesResource.newInstance(copy);
        this.fixture.odds = this.fixture.odds || {};
    }

    title: string = 'Fixtures';
    fixture: any;

    editOdds() {
      this.$scope.setProcessing();
      this.fixture.save(this.fixture).then((result: any) => {
        this.$scope.setFinished();
        this.logger.success('Saved data', result);
        this.$uibModalInstance.close(result); 
        this.$rootScope.$broadcast('oddsUpdated', result);
      })
    }

    cancel() {
      this.$uibModalInstance.dismiss();      
    }
  }
	angular
    .module('admin.fixtures')
    .controller('EditOddsController', EditOddsController);
}