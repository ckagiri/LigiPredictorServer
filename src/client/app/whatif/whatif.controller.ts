namespace app.whatif {
	'use strict';

	export class WhatIfController {
		static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory',
      'fixturePredictionService', ];

		constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
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
    predRounds: any[];
    predRound: number;
    roundsPlayed: number;
    selectedPredRound: any;
    goalsRange = [0,1,2,3,4,5,6,7,8,9];
    homeScore: any;
    awayScore: any;
    canClear: boolean = false;
    SERVER_REFRESHED: boolean = false;
    
    activate() {
      let compressed = this.storage.getItem('compressed-fixtures');
      if(compressed != null) {
        this.localRefresh(compressed);
      } else {
        this.serverRefresh()
      }
    }

    serverRefresh() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          let compressed = data.compressed;
          this.storage.setItem('compressed-fixtures', compressed);
          this.SERVER_REFRESHED = true;
          this.localRefresh(compressed)     
        })
    }

    localRefresh(compressed: any) {
      this.fixtures = this.$window.lzwCompress.unpack(compressed);
      let closestMatchDate = this.leagueSeasonFactory.closestMatchDate(this.fixtures);
      let moment = this.$window.moment;
      let now = moment();
      const closestTime = moment(closestMatchDate);
      const diff = Math.abs(closestTime.diff(now, 'minutes'));
      if(diff < 60 && !this.SERVER_REFRESHED) {
        this.serverRefresh();
      }
      this.season = this.leagueSeasonFactory.createLeagueSeason(this.fixtures);
      this.season1 = angular.copy(this.season);
      this.roundsPlayed = this.leagueSeasonFactory.getRoundsPlayed(this.fixtures);
      let predRounds: any[] = Array.apply(null, {length: this.roundsPlayed}).map((value:any, index: number) => {
        return {
          id: index + 1,
          name: index + 1
        }
      });
      this.predRounds = predRounds.reverse();
      this.predRound = this.roundsPlayed;
      this.selectedPredRound = this.predRounds.filter(n => { return n.id == this.predRound })[0];
      this.onPredStandingRoundChanged();
    }

    goalsChanged() {
      this.season.assign();
      this.season1 = angular.copy(this.season);
      this.canClear = true;
    }

    isFirstRound() {
      return this.season && this.season.isFirstRound();
    }

    isLastRound() {
      return this.season && this.season.isLastRound();
    }

    prevRound() {
      this.season.prevRound();
      this.season1.prevRound();
    }

    nextRound() {
      this.season.nextRound();
      this.season1.nextRound();
    }
    
    onPredStandingRoundChanged() {
      this.predRound = this.selectedPredRound.id
      this.predSeason = this.leagueSeasonFactory.createLeagueSeason(this.fixtures, true, this.predRound); 
    }

    clearAll() {
      let compressed = this.storage.getItem('compressed-fixtures');
      this.localRefresh(compressed);
      this.canClear = false;
    }
	}

	angular
    .module('app.whatif')
    .controller('WhatIfController', WhatIfController);
}