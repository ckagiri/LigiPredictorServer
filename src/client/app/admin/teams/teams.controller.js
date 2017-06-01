var admin;
(function (admin) {
    var teams;
    (function (teams_1) {
        'use strict';
        var TeamsController = (function () {
            function TeamsController($q, teams, logger) {
                this.$q = $q;
                this.teams = teams;
                this.logger = logger;
                this.title = 'Teans';
            }
            return TeamsController;
        }());
        TeamsController.$inject = ['$q', 'teams', 'logger'];
        teams_1.TeamsController = TeamsController;
        angular
            .module('admin.teams')
            .controller('TeamsController', TeamsController);
    })(teams = admin.teams || (admin.teams = {}));
})(admin || (admin = {}));
//# sourceMappingURL=teams.controller.js.map