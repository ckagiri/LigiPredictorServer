namespace admin.seasons {
	'use strict';

	interface ISeasonsVm {
		title: string;
	}

	export class SeasonsController implements ISeasonsVm {
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