namespace admin.leagues {
	'use strict';

	export class LeagueDetailController {
		static $inject: string[] = ['$q', 'league', 'logger'];

		constructor(private $q: ng.IQService,
			private league: app.core.ILeaguesResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'League';
	}

	angular
    .module('admin.leagues')
    .controller('LeagueDetailController', LeagueDetailController);
}