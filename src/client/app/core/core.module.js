var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        angular
            .module('app.core', [
            'ngAnimate', 'ngSanitize', 'ui.router',
            'blocks.exception', 'blocks.logger', 'blocks.router',
            'ngplus', 'ngMessages', 'satellizer', 'nvd3', 'ui.bootstrap'
        ]);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=core.module.js.map