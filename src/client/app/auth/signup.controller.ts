namespace app.auth {
	'use strict';

	interface ISignupVm {
		title: string;
	}

	export class SignupController implements ISignupVm {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Signup';
	}

	angular
    .module('app.auth')
    .controller('SignupController', SignupController);
}