namespace app.auth {
	'use strict';

	export interface ISecurityService {
		login: any;
		logout: any,
		signup: any,
		authenticate: any;
		requestCurrentUser: any,
		currentUser: null,
		isAuthenticated: () => boolean,
		isAdmin: () => boolean,
		requireAdminUser: any,
		requireAuthenticatedUser: any,
		prepareUser: (user?: any) => boolean;
		saveUser: (user: any) => void;
		clearUser: () => void;
	}

	export class SecurityService implements ISecurityService {
		static $inject: string[] = ['$auth', '$http', '$location', '$q', '$state', 'localstorage', 
			'redirectToUrlAfterLogin', 'retryQueue'];
		constructor(
			private $auth: satellizer.IAuthService,
			private $http: ng.IHttpService,
			private $location: ng.ILocationService,
			private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private storage: app.core.ILocalStorageService,
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

		currentUser:any = null;

		login(credentials: any) {
			var request = this.$auth.login(credentials);
			return request.then((response: any) => {
					this.currentUser = response.data.user;
					if (this.isAuthenticated()) {
							this.queue.clear();
					}
					return this.isAuthenticated();
			});
		}

		logout(redirectTo: string) {
			this.$auth.logout().then(() => {
				this.clearUser();
				this.$location.path('/login');
			});
		}
		
		signup(user: any) {
			return this.$auth.signup(user).then((response: any) => {
				this.saveUser(response.data.user);
			});
		}		

		authenticate(provider: string) {
			return this.$auth.authenticate(provider)
        .then((response) => {
					console.log(response.data);
					this.$location.path('/');
        })
		}

		requestCurrentUser() {
			return this.$q.when(this.currentUser);
		}

		isAuthenticated() {
				return !!this.currentUser;
		}

		isAdmin() {
				return !!(this.currentUser && this.currentUser.admin);
		}

		requireAdminUser() {
				var promise = this.requestCurrentUser().then((user) => {
						if (!this.isAdmin()) {
								return this.queue.pushRetryFn('unauthorized-client', this.requireAdminUser);
						}
				});
				return promise;
		}

		requireAuthenticatedUser() {
			var promise = this.requestCurrentUser().then(() => {
				if (!this.isAuthenticated()) {
					return this.queue.pushRetryFn('unauthenticated-client', this.requireAuthenticatedUser);
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

		prepareUser(user: any) {
			let currentUser = user || this.storage.getItem('user');
			if(currentUser) {
				this.currentUser = this.currentUser = currentUser;
				if (this.isAuthenticated()) {
					this.queue.clear();
				}
			}
			return this.isAuthenticated();
		}

		saveUser(user: any) {
			this.storage.setItem('user', user);
			this.prepareUser(user);
		} 

		clearUser() {
			this.storage.removeItem('user');
			this.currentUser = null;
		}

		private gotoLogin() {
			this.$location.path('/login');
		}

		private redirect(url: string) {
			url = url || '/';
			this.$location.path(url);
		}
	}

	angular
    .module('app.auth')
    .service('securityservice', SecurityService);
}