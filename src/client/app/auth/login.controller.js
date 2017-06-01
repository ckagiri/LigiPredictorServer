var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var LoginController = (function () {
            function LoginController(security, $location, $q, $state, logger) {
                this.security = security;
                this.$location = $location;
                this.$q = $q;
                this.$state = $state;
                this.logger = logger;
                this.title = 'Login';
            }
            LoginController.prototype.login = function () {
                var _this = this;
                this.security.login(this.user)
                    .then(function () {
                    _this.logger.success('You have successfully signed in!');
                })
                    .catch(function (error) {
                    _this.logger.error(error.data.message, error.status);
                });
            };
            LoginController.prototype.authenticate = function (provider) {
                var _this = this;
                this.security.authenticate(provider)
                    .catch(function (error) {
                    if (error.message) {
                        // Satellizer promise reject error.
                        _this.logger.error(error.message);
                    }
                    else if (error.data) {
                        // HTTP response error from server
                        _this.logger.error(error.data.message, error.status);
                    }
                    else {
                        _this.logger.error(error);
                    }
                });
            };
            return LoginController;
        }());
        LoginController.$inject = ['securityService', '$location', '$q', '$state', 'logger'];
        auth.LoginController = LoginController;
        angular
            .module('app.auth')
            .controller('LoginController', LoginController);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=login.controller.js.map