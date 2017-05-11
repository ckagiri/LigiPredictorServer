namespace admin.teams {
	'use strict';

	export class TeamsController {
		static $inject: string[] = ['$q', 'teams', 'logger'];

		constructor(private $q: ng.IQService,
			private teams: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Teans';
	}

	angular
    .module('admin.teams')
    .controller('TeamsController', TeamsController);
}