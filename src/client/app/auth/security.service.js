var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var SecurityService = (function () {
            function SecurityService($auth, $http, $location, $q, $state, storage, redirectToUrlAfterLogin, queue) {
                var _this = this;
                this.$auth = $auth;
                this.$http = $http;
                this.$location = $location;
                this.$q = $q;
                this.$state = $state;
                this.storage = storage;
                this.redirectToUrlAfterLogin = redirectToUrlAfterLogin;
                this.queue = queue;
                this.currentUser = null;
                this.queue.onItemAddedCallbacks.push(function (retryItem) {
                    if (queue.hasMore()) {
                        _this.saveAttemptUrl();
                        _this.redirect('/login');
                    }
                });
            }
            SecurityService.prototype.login = function (credentials) {
                var _this = this;
                var request = this.$auth.login(credentials);
                return request.then(function (response) {
                    _this.saveUser(response.data.user);
                    if (_this.isAuthenticated()) {
                        _this.queue.clear();
                    }
                    _this.redirectToAttemptedUrl();
                });
            };
            SecurityService.prototype.logout = function (redirectTo) {
                var _this = this;
                return this.$auth.logout().then(function () {
                    _this.clearUser();
                    _this.redirect(redirectTo);
                });
            };
            SecurityService.prototype.signup = function (user) {
                var _this = this;
                return this.$auth.signup(user).then(function (response) {
                    _this.saveUser(response.data.user);
                    _this.redirect();
                });
            };
            SecurityService.prototype.authenticate = function (provider) {
                var _this = this;
                return this.$auth.authenticate(provider)
                    .then(function (response) {
                    _this.saveUser(response.data.user);
                    if (_this.isAuthenticated()) {
                        _this.queue.clear();
                    }
                    _this.redirectToAttemptedUrl();
                });
            };
            SecurityService.prototype.requestCurrentUser = function () {
                return this.$q.when(this.currentUser);
            };
            SecurityService.prototype.isAuthenticated = function () {
                return !!this.currentUser;
            };
            SecurityService.prototype.isAdmin = function () {
                return !!this.currentUser && !!~this.currentUser.roles.indexOf("admin");
            };
            SecurityService.prototype.requireAdminUser = function () {
                var _this = this;
                var promise = this.requestCurrentUser().then(function (user) {
                    if (!_this.isAuthenticated()) {
                        return _this.queue.pushRetryFn('unauthorized-client', _this.requireAdminUser);
                    }
                });
                return promise;
            };
            SecurityService.prototype.requireAuthenticatedUser = function () {
                var _this = this;
                var promise = this.requestCurrentUser().then(function () {
                    if (!_this.isAuthenticated()) {
                        return _this.queue.pushRetryFn('unauthenticated-client', _this.requireAuthenticatedUser);
                    }
                });
                return promise;
            };
            SecurityService.prototype.saveAttemptUrl = function () {
                if (this.$location.path().toLowerCase() != '/login') {
                    this.redirectToUrlAfterLogin.url = this.$location.path();
                }
            };
            SecurityService.prototype.redirectToAttemptedUrl = function () {
                this.redirect(this.redirectToUrlAfterLogin.url);
            };
            SecurityService.prototype.prepareUser = function (user) {
                var currentUser = user || this.storage.getItem('user');
                if (currentUser) {
                    this.currentUser = currentUser;
                    if (this.isAuthenticated()) {
                        this.queue.clear();
                    }
                }
                return this.isAuthenticated();
            };
            SecurityService.prototype.saveUser = function (user) {
                this.storage.setItem('user', user);
                this.prepareUser(user);
            };
            SecurityService.prototype.clearUser = function () {
                this.storage.removeItem('user');
                this.currentUser = null;
            };
            SecurityService.prototype.redirect = function (url) {
                url = url || '/';
                this.$location.path(url);
            };
            return SecurityService;
        }());
        SecurityService.$inject = ['$auth', '$http', '$location', '$q', '$state', 'localstorage',
            'redirectToUrlAfterLogin', 'retryQueue'];
        auth.SecurityService = SecurityService;
        angular
            .module('app.auth')
            .service('securityService', SecurityService);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=security.service.js.map