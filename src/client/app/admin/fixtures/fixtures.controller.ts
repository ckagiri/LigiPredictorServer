namespace admin.fixtures {
	'use strict';

	export class FixturesController {
		static $inject: string[] = ['$q', 'fixtures', 'logger'];

		constructor(private $q: ng.IQService,
			private fixtures: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Fixtures';
	}

	angular
    .module('admin.fixtures')
    .controller('FixturesController', FixturesController);
}