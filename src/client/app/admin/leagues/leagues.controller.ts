namespace admin.leagues {
	'use strict';

export class LeaguesController {
	static $inject: string[] = ['$q', 'leagues', 'logger'];

	constructor(private $q: ng.IQService,
		private leagues: app.core.IResource,
		private logger: blocks.logger.Logger) {
	}

	title: string = 'Leagues';
}

angular
	.module('admin.leagues')
	.controller('LeaguesController', LeaguesController);
}