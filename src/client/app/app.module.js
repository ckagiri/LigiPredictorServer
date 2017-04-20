var app;
(function (app) {
    'use strict';
    angular.module('app', [
        'app.core',
        'app.layout',
        'app.auth',
        'app.admin',
        'admin.leagues',
        'app.matches'
    ]);
})(app || (app = {}));
//# sourceMappingURL=app.module.js.map