namespace admin.seasons {
	'use strict';

	export class SeasonRoundsController {
		static $inject: string[] = ['$stateParams', 'rounds', 'logger'];

		constructor(private $stateParams: ng.ui.IStateParamsService,
			private rounds: app.core.IRoundsResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Rounds';
		leagueId: string = this.$stateParams.leagueId;
		seasonId: string = this.$stateParams.seasonId;
	}

	angular
    .module('admin.seasons')
    .controller('SeasonRoundsController', SeasonRoundsController);
}