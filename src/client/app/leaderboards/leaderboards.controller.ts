namespace app.leaderboards {
	'use strict';

	export class LeaderboardsController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Leaderboards';
		
	}

	angular
    .module('app.leaderboards')
    .controller('LeaderboardsController', LeaderboardsController);
}