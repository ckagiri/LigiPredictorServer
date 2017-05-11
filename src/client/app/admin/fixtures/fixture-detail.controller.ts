namespace admin.fixtures {
	'use strict';

	export class FixtureDetailController {
		static $inject: string[] = ['$q', 'fixture', 'logger'];

		constructor(private $q: ng.IQService,
			private fixture: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Fixture';
	}

	angular
    .module('admin.fixtures')
    .controller('FixtureDetailController', FixtureDetailController);
}