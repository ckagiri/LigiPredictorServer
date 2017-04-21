namespace app.auth {
	'use strict';

	export interface ISignupServerResponse {
		token: string, isLinking?: boolean
	}

	export class SignupController {
		static $inject: string[] = ['$auth', '$q', '$state', 'logger'];

		constructor(
			private $auth: satellizer.IAuthService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
      private logger: blocks.logger.Logger) {
    }

		user: { userName: string; email: string; password: string; };
		confirmPassword: string;		
		title: string = 'Signup';

		signup() {
      this.$auth.signup<ISignupServerResponse>(this.user)
        .then((response) => {
          this.$auth.setToken(response.data.token);
          this.$state.go('/');
          this.logger.info('You have successfully created a new account and have been signed-in');
        })
        .catch((response) => {
          this.logger.error(response.data.message);
        });
    };
	}

	angular
    .module('app.auth')
    .controller('SignupController', SignupController);
}