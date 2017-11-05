var admin;
(function (admin) {
    var leagues;
    (function (leagues) {
        'use strict';
        var LeagueDetailController = /** @class */ (function () {
            function LeagueDetailController($q, league, logger) {
                this.$q = $q;
                this.league = league;
                this.logger = logger;
                this.title = 'League';
            }
            LeagueDetailController.$inject = ['$q', 'league', 'logger'];
            return LeagueDetailController;
        }());
        leagues.LeagueDetailController = LeagueDetailController;
        angular
            .module('admin.leagues')
            .controller('LeagueDetailController', LeagueDetailController);
    })(leagues = admin.leagues || (admin.leagues = {}));
})(admin || (admin = {}));
//# sourceMappingURL=league-detail.controller.js.map