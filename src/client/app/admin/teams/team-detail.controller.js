var admin;
(function (admin) {
    var teams;
    (function (teams) {
        'use strict';
        var TeamDetailController = (function () {
            function TeamDetailController($q, team, logger) {
                this.$q = $q;
                this.team = team;
                this.logger = logger;
                this.title = 'Team';
            }
            return TeamDetailController;
        }());
        TeamDetailController.$inject = ['$q', 'team', 'logger'];
        teams.TeamDetailController = TeamDetailController;
        angular
            .module('admin.teams')
            .controller('TeamDetailController', TeamDetailController);
    })(teams = admin.teams || (admin.teams = {}));
})(admin || (admin = {}));
//# sourceMappingURL=team-detail.controller.js.map