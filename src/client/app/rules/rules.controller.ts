namespace app.rules {
	'use strict';

	export class RulesController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Rules';
	}

	angular
    .module('app.rules')
    .controller('RulesController', RulesController);
}