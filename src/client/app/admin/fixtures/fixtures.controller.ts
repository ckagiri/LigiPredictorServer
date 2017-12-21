namespace admin.fixtures {
	'use strict';

	export class FixturesController {
		static $inject: string[] = ['$q', 'fixtures', 'logger', 'Modal'];

    constructor(private $q: ng.IQService,
			private fixtures: app.core.IResource[],
      private logger: blocks.logger.Logger,
      private Modal: any) {
    }

    title: string = 'Fixtures';

    editOdds(fixture: any) {
      let modalInstance: any = this.Modal({
        templateUrl: 'app/admin/fixtures/edit-odds-modal.html',
        controller: 'EditOddsController',
        controllerAs: 'vm',
        size: 'sm',       
        model: fixture,
      });
      
      modalInstance.then((data:any) => {
        let match:any = this.fixtures.filter(n =>{ return n.id() == data._id})[0];
        angular.extend(match, data);
        console.log(match);
        //findone and update
      });
    }
	}

	angular
    .module('admin.fixtures')
    .controller('FixturesController', FixturesController);
}