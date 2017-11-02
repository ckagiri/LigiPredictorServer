var app;
(function (app) {
    var rules;
    (function (rules) {
        'use strict';
        var RulesController = (function () {
            function RulesController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Rules';
            }
            return RulesController;
        }());
        RulesController.$inject = ['$q', 'logger'];
        rules.RulesController = RulesController;
        angular
            .module('app.rules')
            .controller('RulesController', RulesController);
    })(rules = app.rules || (app.rules = {}));
})(app || (app = {}));
//# sourceMappingURL=rules.controller.js.map