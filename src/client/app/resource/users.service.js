var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        UsersResource.$inject = ['resource'];
        function UsersResource(resource) {
            var Users = resource("users");
            return Users;
        }
        angular
            .module('app.core')
            .factory('UsersResource', UsersResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=users.service.js.map