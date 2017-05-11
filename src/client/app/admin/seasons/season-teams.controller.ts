namespace admin.seasons {
	'use strict';

	export class SeasonTeamsController {
		static $inject: string[] = ['$q', 'teams', 'logger'];

		constructor(private $q: ng.IQService,
			private teams: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Teans';
	}

	angular
    .module('admin.teams')
    .controller('SeasonTeamsController', SeasonTeamsController);
}