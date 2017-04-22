namespace app.auth {
	'use strict';

	export interface ILoginServerResponse {
		token: string, isLinking?: boolean
	}

	export interface IAuthenticateServerResponse {
		token: string, isLinking?: boolean
	}

	export class LoginController {
		static $inject: string[] = ['$auth', '$q', '$state', 'logger'];
		constructor(
			private $auth: satellizer.IAuthService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
      private logger: blocks.logger.Logger) {
    }

		user: { email: string; password: string; };
		title: string = 'Login';

		login() {
      this.$auth.login(this.user)
        .then(() => {
          this.logger.success('You have successfully signed in!');
          this.$state.go('/');
        })
        .catch((error) => {
          this.logger.error(error.data.message, error.status);
        });
    };

    authenticate(provider: string) {
      this.$auth.authenticate(provider)
        .then(() => {
          this.logger.success('You have successfully signed in with ' + provider + '!');
          this.$state.go('/');
        })
        .catch((error) => {
          if (error.message) {
            // Satellizer promise reject error.
            this.logger.error(error.message);
          } else if (error.data) {
            // HTTP response error from server
            this.logger.error(error.data.message, error.status);
          } else {
            this.logger.error(error);
          }
        });
    };
	}

	angular
    .module('app.auth')
    .controller('LoginController', LoginController);
}