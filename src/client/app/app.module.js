var app;
(function (app) {
    'use strict';
    angular.module('app', [
        'app.core',
        'app.directives',
        'app.layout',
        'app.auth',
        'app.admin',
        'admin.leagues',
        'admin.seasons',
        'app.matches'
    ]);
})(app || (app = {}));
//# sourceMappingURL=app.module.js.map