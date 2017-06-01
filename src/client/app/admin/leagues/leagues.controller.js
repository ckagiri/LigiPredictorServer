var admin;
(function (admin) {
    var leagues;
    (function (leagues_1) {
        'use strict';
        var LeaguesController = (function () {
            function LeaguesController($q, leagues, logger) {
                this.$q = $q;
                this.leagues = leagues;
                this.logger = logger;
                this.title = 'Leagues';
            }
            return LeaguesController;
        }());
        LeaguesController.$inject = ['$q', 'leagues', 'logger'];
        leagues_1.LeaguesController = LeaguesController;
        angular
            .module('admin.leagues')
            .controller('LeaguesController', LeaguesController);
    })(leagues = admin.leagues || (admin.leagues = {}));
})(admin || (admin = {}));
//# sourceMappingURL=leagues.controller.js.map