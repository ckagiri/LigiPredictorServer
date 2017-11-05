var admin;
(function (admin) {
    var seasons;
    (function (seasons) {
        'use strict';
        var SeasonRoundsController = (function () {
            function SeasonRoundsController($stateParams, rounds, logger) {
                this.$stateParams = $stateParams;
                this.rounds = rounds;
                this.logger = logger;
                this.title = 'Rounds';
                this.leagueId = this.$stateParams.leagueId;
                this.seasonId = this.$stateParams.seasonId;
            }
            return SeasonRoundsController;
        }());
        SeasonRoundsController.$inject = ['$stateParams', 'rounds', 'logger'];
        seasons.SeasonRoundsController = SeasonRoundsController;
        angular
            .module('admin.seasons')
            .controller('SeasonRoundsController', SeasonRoundsController);
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=season-rounds.controller.js.map