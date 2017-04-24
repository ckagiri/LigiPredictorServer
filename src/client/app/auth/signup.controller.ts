namespace app.auth {
	'use strict';

	export interface ISignupServerResponse {
		token: string, isLinking?: boolean
	}

	export class SignupController {
		static $inject: string[] = ['securityService', '$q', '$state', 'logger'];

		constructor(
			private security: app.auth.ISecurityService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
      private logger: blocks.logger.Logger) {
    }

		user: { userName: string; email: string; password: string; };
		confirmPassword: string;		
		title: string = 'Signup';

		signup() {
      this.security.signup(this.user)
        .then(() => {
          this.logger.info('You have successfully created a new account and have been signed-in');
        })
        .catch((response: any) => {
          this.logger.error(response.data.message);
        });
    };
	}

	angular
    .module('app.auth')
    .controller('SignupController', SignupController);
}