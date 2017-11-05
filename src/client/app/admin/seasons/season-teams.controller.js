var admin;
(function (admin) {
    var seasons;
    (function (seasons) {
        'use strict';
        var SeasonTeamsController = /** @class */ (function () {
            function SeasonTeamsController($q, teams, logger) {
                this.$q = $q;
                this.teams = teams;
                this.logger = logger;
                this.title = 'Teans';
            }
            SeasonTeamsController.$inject = ['$q', 'teams', 'logger'];
            return SeasonTeamsController;
        }());
        seasons.SeasonTeamsController = SeasonTeamsController;
        angular
            .module('admin.seasons')
            .controller('SeasonTeamsController', SeasonTeamsController);
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=season-teams.controller.js.map