var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var config = {
            appErrorPrefix: '[Ligi:Error] ',
            appTitle: 'Ligi Predictor'
        };
        angular
            .module('app.core')
            .config(toastrConfig)
            .config(configure)
            .value('config', config);
        toastrConfig.$inject = ['toastr'];
        /* @ngInject */
        function toastrConfig(toastr) {
            toastr.options.timeOut = 4000;
            toastr.options.positionClass = 'toast-bottom-right';
        }
        configure.$inject = ['$logProvider', 'exceptionHandlerProvider', 'routerHelperProvider'];
        /* @ngInject */
        function configure($logProvider, exceptionHandlerProvider, routerHelperProvider) {
            if ($logProvider.debugEnabled) {
                $logProvider.debugEnabled(true);
            }
            exceptionHandlerProvider.configure(config.appErrorPrefix);
            routerHelperProvider.configure({
                docTitle: 'LP: ',
                resolveAlways: {}
            });
        }
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=config.js.map