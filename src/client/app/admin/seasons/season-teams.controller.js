var admin;
(function (admin) {
    var seasons;
    (function (seasons) {
        'use strict';
        var SeasonTeamsController = (function () {
            function SeasonTeamsController($q, teams, logger) {
                this.$q = $q;
                this.teams = teams;
                this.logger = logger;
                this.title = 'Teans';
            }
            return SeasonTeamsController;
        }());
        SeasonTeamsController.$inject = ['$q', 'teams', 'logger'];
        seasons.SeasonTeamsController = SeasonTeamsController;
        angular
            .module('admin.seasons')
            .controller('SeasonTeamsController', SeasonTeamsController);
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=season-teams.controller.js.map