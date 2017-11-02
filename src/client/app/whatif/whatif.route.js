var app;
(function (app) {
    var whatif;
    (function (whatif) {
        'use strict';
        angular
            .module('app.whatif')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.whatif',
                    config: {
                        url: '/what-if',
                        templateUrl: 'app/whatif/whatif.html',
                        controller: 'WhatIfController',
                        controllerAs: 'vm',
                        title: 'whatif'
                    }
                }
            ];
        }
    })(whatif = app.whatif || (app.whatif = {}));
})(app || (app = {}));
//# sourceMappingURL=whatif.route.js.map