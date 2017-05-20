namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', 'matches', 'logger'];

		constructor(private $q: ng.IQService,
			private matches: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Matches';
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}