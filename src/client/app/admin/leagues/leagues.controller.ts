namespace admin.leagues {
	'use strict';

	interface ILeaguesVm {
		title: string;
	}

	export class LeaguesController implements ILeaguesVm {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Leagues';
	}

	angular
    .module('admin.leagues')
    .controller('LeaguesController', LeaguesController);
}