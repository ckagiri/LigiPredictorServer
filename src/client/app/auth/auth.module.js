var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        auth.redirect = "name";
        config.$inject = ['$authProvider'];
        function config($authProvider) {
            $authProvider.google({
                clientId: '878230370671-k3ves4plp9gl7l9fvpvr3pse3mok0f9q.apps.googleusercontent.com'
            });
            $authProvider.facebook({
                clientId: '1895048740742132'
            });
        }
        appRun.$inject = ['securityService'];
        function appRun(security) {
            security.prepareUser();
        }
        angular.module('app.auth', ['app.core'])
            .config(config)
            .value('redirectToUrlAfterLogin', { url: '/' })
            .run(appRun);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=auth.module.js.map