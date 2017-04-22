namespace app.auth {
	'use strict';

	export interface ISecurityService {
		login: any,
		logout: any,
		requestCurrentUser: any,
		currentUser: null,
		isAuthenticated: () => boolean,
		isAdmin: () => boolean,
		requireAdminUser: any,
		requireAuthenticatedUser: any
	}


	export class securityService {
		static $inject: string[] = ['$auth', '$http', '$location', '$q', '$state', 'redirectToUrlAfterLogin', 'retryQueue'];
		constructor(
			private $auth: satellizer.IAuthService,
			private $http: ng.IHttpService,
			private $location: ng.ILocationService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private redirectToUrlAfterLogin: any,
			private queue: IRetryQueue
		) {	
			this.queue.onItemAddedCallbacks.push(function(retryItem: any) {
				if (queue.hasMore()) {
					this.saveAttemptUrl();
					this.gotoLogin();
				}
			});
		}

		login(credentials: any) {
			var request = this.$auth.login(credentials);
			return request.then(function(response) {
					this.currentUser = response.data;
					if (this.isAuthenticated()) {
							this.queue.clear();
					}
					return this.isAuthenticated();
			});
		}

		logout(redirectTo: string) {
			this.$auth.logout().then(function() {
				this.currentUser = null;
				this.$state.go('login');
			});
		}

		requestCurrentUser() {
				if (this.isAuthenticated()) {
						return this.$q.when(this.currentUser);
				} else {
						return this.$q.reject();
				}
		}

		isAuthenticated() {
				return !!this.currentUser;
		}

		isAdmin() {
				return !!(this.currentUser && this.currentUser.admin);
		}

		requireAdminUser() {
				var promise = this.requestCurrentUser().then(function(userInfo) {
						if (!this.isAdmin()) {
								return this.queue.pushRetryFn('unauthorized-client', this.requireAdminUser);
						}
				});
				return promise;
		}

		requireAuthenticatedUser() {
			var promise = this.requestCurrentUser().then(function(userInfo) {
				if (!this.isAuthenticated()) {
					return this.queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
				}
			});
			return promise;
		}

    saveAttemptUrl() {
			if (this.$location.path().toLowerCase() != '/login') {
				this.redirectToUrlAfterLogin.url = this.$location.path();
			}
		}

		redirectToAttemptedUrl() {
			this.redirect(this.redirectToUrlAfterLogin.url);
		}

		private gotoLogin() {
			this.$location.path('/login');
		}

		private redirect(url: string) {
			url = url || '/';
			this.$location.path(url);
		}
	}
}