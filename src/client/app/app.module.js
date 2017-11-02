var app;
(function (app) {
    'use strict';
    angular.module('app', [
        'app.core',
        'app.directives',
        'app.layout',
        'app.auth',
        'admin.leagues',
        'admin.seasons',
        'admin.fixtures',
        'admin.teams',
        'admin.users',
        'app.matches',
        'app.predictions',
        'app.leaderboards',
        'app.rules',
        'app.whatif',
        'app.stats'
    ]);
})(app || (app = {}));
//# sourceMappingURL=app.module.js.map