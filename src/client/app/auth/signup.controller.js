var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var SignupController = (function () {
            function SignupController(security, $q, $state, logger) {
                this.security = security;
                this.$q = $q;
                this.$state = $state;
                this.logger = logger;
                this.title = 'Signup';
            }
            SignupController.prototype.signup = function () {
                var _this = this;
                this.security.signup(this.user)
                    .then(function () {
                    _this.logger.info('You have successfully created a new account and have been signed-in');
                })
                    .catch(function (response) {
                    _this.logger.error(response.data.message);
                });
            };
            ;
            return SignupController;
        }());
        SignupController.$inject = ['securityService', '$q', '$state', 'logger'];
        auth.SignupController = SignupController;
        angular
            .module('app.auth')
            .controller('SignupController', SignupController);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=signup.controller.js.map