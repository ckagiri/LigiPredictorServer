namespace admin.teams {
	'use strict';

	export class TeamDetailController {
		static $inject: string[] = ['$q', 'team', 'logger'];

		constructor(private $q: ng.IQService,
			private team: app.core.ITeamsResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Team';
	}

	angular
    .module('admin.teams')
    .controller('TeamDetailController', TeamDetailController);
}