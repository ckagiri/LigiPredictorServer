var admin;
(function (admin) {
    var seasons;
    (function (seasons_1) {
        'use strict';
        var SeasonsController = /** @class */ (function () {
            function SeasonsController($stateParams, seasons, logger) {
                this.$stateParams = $stateParams;
                this.seasons = seasons;
                this.logger = logger;
                this.title = 'Seasons';
                this.leagueId = this.$stateParams.leagueId;
            }
            SeasonsController.$inject = ['$stateParams', 'seasons', 'logger'];
            return SeasonsController;
        }());
        seasons_1.SeasonsController = SeasonsController;
        angular
            .module('admin.seasons')
            .controller('SeasonsController', SeasonsController);
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=seasons.controller.js.map