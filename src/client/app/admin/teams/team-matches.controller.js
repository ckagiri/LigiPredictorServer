var admin;
(function (admin) {
    var teams;
    (function (teams_1) {
        'use strict';
        var TeamMatchesController = /** @class */ (function () {
            function TeamMatchesController($q, teams, logger) {
                this.$q = $q;
                this.teams = teams;
                this.logger = logger;
                this.title = 'Teans';
            }
            TeamMatchesController.$inject = ['$q', 'teams', 'logger'];
            return TeamMatchesController;
        }());
        teams_1.TeamMatchesController = TeamMatchesController;
        angular
            .module('admin.teams')
            .controller('TeamMatchesController', TeamMatchesController);
    })(teams = admin.teams || (admin.teams = {}));
})(admin || (admin = {}));
//# sourceMappingURL=team-matches.controller.js.map