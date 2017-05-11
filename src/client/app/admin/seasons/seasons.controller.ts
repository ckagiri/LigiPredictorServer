namespace admin.seasons {
	'use strict';

	export class SeasonsController {
		static $inject: string[] = ['$q', 'seasons', 'logger'];

		constructor(private $q: ng.IQService,
			private seasons: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Seasons';
	}

	angular
    .module('admin.seasons')
    .controller('SeasonsController', SeasonsController);
}