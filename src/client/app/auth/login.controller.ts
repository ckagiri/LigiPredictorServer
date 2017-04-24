namespace app.auth {
	'use strict';

	export interface IServerResponse {
		token: string, isLinking?: boolean, user: any
	}

	export class LoginController {
		static $inject: string[] = ['securityService', '$location', '$q', '$state', 'logger'];
		constructor(
			private security: app.auth.ISecurityService,
			private $location: ng.ILocationService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
      private logger: blocks.logger.Logger) {
    }

		user: { email: string; password: string; };
		title: string = 'Login';

		login() {
      this.security.login(this.user)
        .then(() => {
          this.logger.success('You have successfully signed in!');
        })
        .catch((error: any) => {
          this.logger.error(error.data.message, error.status);
        });
    }

    authenticate(provider: string) {
      this.security.authenticate(provider)
        .catch((error: any) => {
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