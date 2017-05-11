namespace admin.rounds {
	'use strict';

	export class RoundsController {
		static $inject: string[] = ['$q', 'rounds', 'logger'];

		constructor(private $q: ng.IQService,
			private rounds: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Rounds';
	}

	angular
    .module('admin.rounds')
    .controller('RoundsController', RoundsController);
}