namespace app.whatif {
	'use strict';

	export class WhatIfController {
		static $inject: string[] = ['$q', '$window', 'logger', 'leagueSeasonFactory',
      'fixturePredictionService', ];

		constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private logger: blocks.logger.Logger,
      private leagueSeasonFactory: any,
      private fixturePredictionService: app.core.IFixturePredictionService) {
        this.activate()
    }

		title: string = 'WhatIf';
    fixtures: any[]
    season: any;
    season1: any;
    predSeason: any;

    activate() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          this.fixtures = this.$window.lzwCompress.unpack(data.compressed);
          this.season = this.leagueSeasonFactory.createLeagueSeason(this.fixtures);
          this.season1 = angular.copy(this.season);
          this.predSeason = this.leagueSeasonFactory.createLeagueSeason(this.fixtures, true);
        });
    }

    goalsChanged(match: any) {
      match.setScore(match.getHomeScore(), match.getAwayScore());
      this.season.assign();
      this.season1 = angular.copy(this.season);
    }

    addHomeScore(match: any) {
			match.setScore(match.getHomeScore() + 1, match.getAwayScore());
      this.season.assign();
      this.season1 = angular.copy(this.season);
		}

		addAwayScore(match: any) {
			match.setScore(match.getHomeScore(), match.getAwayScore() + 1);
      this.season.assign();
      this.season1 = angular.copy(this.season);
		}
	}

	angular
    .module('app.whatif')
    .controller('WhatIfController', WhatIfController);
}