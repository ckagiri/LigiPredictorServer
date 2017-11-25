var app;
(function (app) {
    var whatif;
    (function (whatif) {
        'use strict';
        var WhatIfController = (function () {
            function WhatIfController($q, $window, logger, leagueSeasonFactory, fixturePredictionService) {
                this.$q = $q;
                this.$window = $window;
                this.logger = logger;
                this.leagueSeasonFactory = leagueSeasonFactory;
                this.fixturePredictionService = fixturePredictionService;
                this.title = 'WhatIf';
                this.activate();
            }
            WhatIfController.prototype.activate = function () {
                var _this = this;
                this.fixturePredictionService.getFixturesWithPredictions()
                    .then(function (data) {
                    _this.fixtures = _this.$window.lzwCompress.unpack(data.compressed);
                    _this.season = _this.leagueSeasonFactory.createLeagueSeason(_this.fixtures);
                    _this.season1 = angular.copy(_this.season);
                    _this.predSeason = _this.leagueSeasonFactory.createLeagueSeason(_this.fixtures, true);
                });
            };
            WhatIfController.prototype.goalsChanged = function (match) {
                match.setScore(match.getHomeScore(), match.getAwayScore());
                this.season.assign();
                this.season1 = angular.copy(this.season);
            };
            WhatIfController.prototype.addHomeScore = function (match) {
                match.setScore(match.getHomeScore() + 1, match.getAwayScore());
                this.season.assign();
                this.season1 = angular.copy(this.season);
            };
            WhatIfController.prototype.addAwayScore = function (match) {
                match.setScore(match.getHomeScore(), match.getAwayScore() + 1);
                this.season.assign();
                this.season1 = angular.copy(this.season);
            };
            return WhatIfController;
        }());
        WhatIfController.$inject = ['$q', '$window', 'logger', 'leagueSeasonFactory',
            'fixturePredictionService',];
        whatif.WhatIfController = WhatIfController;
        angular
            .module('app.whatif')
            .controller('WhatIfController', WhatIfController);
    })(whatif = app.whatif || (app.whatif = {}));
})(app || (app = {}));
//# sourceMappingURL=whatif.controller.js.map