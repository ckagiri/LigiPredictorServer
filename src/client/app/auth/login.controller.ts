namespace app.auth {
	'use strict';

	interface ILoginVm {
		title: string;
	}

	export class LoginController implements ILoginVm {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Login';
	}

	angular
    .module('app.auth')
    .controller('LoginController', LoginController);
}