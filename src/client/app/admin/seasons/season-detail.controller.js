var admin;
(function (admin) {
    var seasons;
    (function (seasons) {
        'use strict';
        var SeasonDetailController = (function () {
            function SeasonDetailController($q, season, logger) {
                this.$q = $q;
                this.season = season;
                this.logger = logger;
                this.title = 'Season';
            }
            return SeasonDetailController;
        }());
        SeasonDetailController.$inject = ['$q', 'season', 'logger'];
        seasons.SeasonDetailController = SeasonDetailController;
        angular
            .module('admin.seasons')
            .controller('SeasonDetailController', SeasonDetailController);
    })(seasons = admin.seasons || (admin.seasons = {}));
})(admin || (admin = {}));
//# sourceMappingURL=season-detail.controller.js.map