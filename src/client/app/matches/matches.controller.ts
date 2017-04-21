namespace app.matches {
	'use strict';

	interface IMatchesVm {
		title: string;
	}

	export class MatchesController implements IMatchesVm {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Matches';
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}