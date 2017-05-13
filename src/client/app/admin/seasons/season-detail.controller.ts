namespace admin.seasons {
	'use strict';

	export class SeasonDetailController {
		static $inject: string[] = ['$q', 'season', 'logger'];

		constructor(private $q: ng.IQService,
			private season: app.core.ISeasonsResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Season';
	}

	angular
    .module('admin.seasons')
    .controller('SeasonDetailController', SeasonDetailController);
}