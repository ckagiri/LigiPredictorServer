var app;
(function (app) {
    var rules;
    (function (rules) {
        'use strict';
        angular
            .module('app.rules')
            .run(appRun);
        appRun.$inject = ['routerHelper'];
        function appRun(routerHelper) {
            var states = getStates();
            routerHelper.configureStates(states);
        }
        function getStates() {
            return [
                {
                    state: 'app.rules',
                    config: {
                        url: '/rules',
                        templateUrl: 'app/rules/rules.html',
                        controller: 'RulesController',
                        controllerAs: 'vm',
                        title: 'rules'
                    }
                }
            ];
        }
    })(rules = app.rules || (app.rules = {}));
})(app || (app = {}));
//# sourceMappingURL=rules.route.js.map