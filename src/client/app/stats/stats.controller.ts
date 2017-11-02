namespace app.stats {
	'use strict';

	export class StatsController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Stats';
	}

	angular
    .module('app.stats')
    .controller('StatsController', StatsController);
}