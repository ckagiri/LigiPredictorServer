namespace admin.users {
	'use strict';

	export class UsersController {
		static $inject: string[] = ['$q', 'users', 'logger'];

		constructor(private $q: ng.IQService,
			private users: app.core.IResource,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Users';
	}

	angular
    .module('admin.users')
    .controller('UsersController', UsersController);
}