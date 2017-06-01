var admin;
(function (admin) {
    var teams;
    (function (teams_1) {
        'use strict';
        var TeamMatchesController = (function () {
            function TeamMatchesController($q, teams, logger) {
                this.$q = $q;
                this.teams = teams;
                this.logger = logger;
                this.title = 'Teans';
            }
            return TeamMatchesController;
        }());
        TeamMatchesController.$inject = ['$q', 'teams', 'logger'];
        teams_1.TeamMatchesController = TeamMatchesController;
        angular
            .module('admin.teams')
            .controller('TeamMatchesController', TeamMatchesController);
    })(teams = admin.teams || (admin.teams = {}));
})(admin || (admin = {}));
//# sourceMappingURL=team-matches.controller.js.map