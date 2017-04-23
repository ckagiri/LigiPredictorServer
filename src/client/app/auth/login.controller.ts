namespace app.auth {
	'use strict';

	export interface IServerResponse {
		token: string, isLinking?: boolean, user: any
	}

	export class LoginController {
		static $inject: string[] = ['$auth', '$location', '$q', '$state', 'logger'];
		constructor(
			private $auth: satellizer.IAuthService,
			private $location: ng.ILocationService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
      private logger: blocks.logger.Logger) {
    }

		user: { email: string; password: string; };
		title: string = 'Login';

		login() {
      this.$auth.login<IServerResponse>(this.user)
        .then((response) => {
					console.log(response.data);
          this.logger.success('You have successfully signed in!');
					this.$location.path('/');
        })
        .catch((error) => {
          this.logger.error(error.data.message, error.status);
        });
    }

    authenticate(provider: string) {
      this.$auth.authenticate<IServerResponse>(provider)
        .then((response) => {
					console.log(response.data);
          this.logger.success('You have successfully signed in with ' + provider + '!');
					this.$location.path('/');
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
    }
	}

	angular
    .module('app.auth')
    .controller('LoginController', LoginController);
}