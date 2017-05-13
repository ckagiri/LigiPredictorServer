namespace admin.seasons {
	'use strict';

	export class SeasonRoundsController {
		static $inject: string[] = ['$q', 'rounds', 'logger'];

		constructor(private $q: ng.IQService,
			private rounds: app.core.IRoundsResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Rounds';
	}

	angular
    .module('admin.seasons')
    .controller('SeasonRoundsController', SeasonRoundsController);
}