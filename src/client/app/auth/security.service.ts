namespace app.auth {
	'use strict';

	export interface ISecurityService {
		login: (user: any) => ng.IPromise<any>;
		logout: (redirectTo?: string) => ng.IPromise<any>;
		signup: (user: any) => ng.IPromise<any>;
		authenticate: (provider: string) => ng.IPromise<any>;
		requestCurrentUser: () => ng.IPromise<any>;
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
			this.queue.onItemAddedCallbacks.push((retryItem: any) => {
				if (queue.hasMore()) {
					this.saveAttemptUrl();
					this.redirect('/login');
				}
			});
		}

		currentUser:any = null;

		login(credentials: any) {
			var request = this.$auth.login(credentials);
			return request.then((response: any) => {
				this.saveUser(response.data.user);
				if (this.isAuthenticated()) {
						this.queue.clear();
				}
				this.redirectToAttemptedUrl();
			});
		}

		logout(redirectTo?: string) {
			return this.$auth.logout().then(() => {
				this.clearUser();
				this.redirect(redirectTo);
			});
		}
		
		signup(user: any) {
			return this.$auth.signup(user).then((response: any) => {
				this.saveUser(response.data.user);
				this.redirect();
			});
		}		

		authenticate(provider: string) {
			return this.$auth.authenticate(provider)
        .then((response: any) => {
					this.saveUser(response.data.user);
					if (this.isAuthenticated()) {
							this.queue.clear();
					}
					this.redirectToAttemptedUrl();
			});
		}

		requestCurrentUser() {
			return this.$q.when(this.currentUser);
		}

		isAuthenticated() {
			return !!this.currentUser;
		}

		isAdmin() {
			return !!this.currentUser && !!~this.currentUser.roles.indexOf("admin");
		}

		requireAdminUser() {
			var promise = this.requestCurrentUser().then((user) => {
				if (!this.isAuthenticated()) {
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

		prepareUser(user?: any) {
			let currentUser = user || this.storage.getItem('user');
			if(currentUser) {
				this.currentUser = currentUser;
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

		private redirect(url?: string) {
			url = url || '/';
			this.$location.path(url);
		}
	}

	angular
    .module('app.auth')
    .service('securityService', SecurityService);
}