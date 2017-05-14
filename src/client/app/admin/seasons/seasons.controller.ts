namespace admin.seasons {
	'use strict';

	export class SeasonsController {
		static $inject: string[] = ['$stateParams', 'seasons', 'logger'];

		constructor(
			private $stateParams: ng.ui.IStateParamsService,
			private seasons: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }
	
		title: string = 'Seasons';
		leagueId: string = this.$stateParams.leagueId
	}

	angular
    .module('admin.seasons')
    .controller('SeasonsController', SeasonsController);
}