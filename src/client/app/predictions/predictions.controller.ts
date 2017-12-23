namespace app.predictions {
  'use strict';

  export class PredictionsController {
    static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory',
      'fixturePredictionService', 'EntitySet', 'Fixture', 'sort', 'predictionFilter'];

    constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
      private logger: blocks.logger.Logger,
      private leagueSeasonFactory: any,
      private fixturePredictionService: app.core.IFixturePredictionService,
      private EntitySet: any,
      private Fixture: any,
      private sort: app.core.ISortService,
      private filter: any) {
      this.activate();
    }

    title: string = 'Predictions';
    compressed: any;
    fixtures: any[];
    paging = {
      currentPage: 1,
      maxPagesToShow: 5,
      pageSize: 10,
      pageCount: 0     
    };
    fixtureSet: any;
    fixtureFilteredCount: number;
    fixtureCount: number;
    rounds: number[]
    selectedRound: any;
    summary = {
      points: 0,
      goalDiff: 0,
      pointsExcJoker: 0,
      goalDiffExcJoker: 0,
      matches: 0,
      correctOutcome: 0
    };
    SERVER_REFRESHED: boolean = false;

    activate() {
      this.init();
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
      let fixtures = this.$window.lzwCompress.unpack(compressed);
      let closestMatchDate = this.leagueSeasonFactory.closestMatchDate(fixtures);
      let moment = this.$window.moment;
      let now = moment();
      const closestTime = moment(closestMatchDate);
      const diff = Math.abs(closestTime.diff(now, 'minutes'));
      if(diff < 60 && !this.SERVER_REFRESHED) {
        this.serverRefresh();
      }
      this.fixtureSet = new this.EntitySet(this.Fixture);
      this.fixtureSet.mapDtoListToContext(fixtures);
      this.roundChanged();   
    }

    init() {
      Object.defineProperty(this.paging, 'showing', {
        get: () => {
          let paging = this.paging,
            itemCount = this.fixtureFilteredCount;
          if (itemCount === 0) {
            return "";
          }
          let resultStart = (paging.currentPage - 1) * paging.pageSize + 1;
          let resultEnd = resultStart + paging.pageSize - 1;
          if (resultEnd > itemCount) {
            resultEnd = itemCount;
          }
          return "showing " + resultStart + " - " + resultEnd + " of " + (itemCount || 0);
        }
      });

      let val = this.fixtureFilteredCount / this.paging.pageSize;
      let pageCount = Math.floor(val);
      if (!isNumber(val)) {
        pageCount += 1;
      }
      this.paging.pageCount = pageCount;

      this.rounds = Array.apply(null, {length: 38}).map((value:any, index: number) => {
        return {
          id: index + 1,
          name: index+1
        }
      });
    }

    roundChanged() {
      if(this.selectedRound != null) {
        this.filter.round = this.selectedRound.id; 
      } else {
        this.filter.round = -1;      
      }
      this.pageChanged();
    }

    summarize() {
      var summary = {
        points: 0,
        goalDiff: 0,
        pointsExcJoker: 0,
        goalDiffExcJoker: 0,
        matches: 0,
        correctOutcome: 0
      };
      this.summary = this.fixtureSet.getAll({filter: this.filter}).reduce((accum: any, fixture:any) => {
        let prediction = fixture.prediction;
        if(prediction == null || prediction.points == null) {return accum;}
        accum.points += prediction.points;
        accum.goalDiff += prediction.goalDiff;
        accum.pointsExcJoker += prediction.points;
        accum.goalDiffExcJoker += prediction.goalDiff;
        if(prediction.hasJoker && prediction.goalDiff >= 0 && prediction.points > 0) {
          accum.points += prediction.points;
          accum.goalDiff += prediction.goalDiff;
        }
        accum.matches += 1;
        let result = fixture.result;
        let choice = prediction.choice;
        let choiceOutcome = this.calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
        let resultOutcome = this.calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
        if(choiceOutcome == resultOutcome) {
          accum.correctOutcome += 1;
        }
        return accum;
      }, summary);
    }

    pageChanged() {
      this.fixtureCount = this.fixtureSet.getCount();
      this.fixtureFilteredCount = this.fixtureSet.getFilteredCount(this.filter);
      this.fixtures = this.fixtureSet.getAll({
        filter: this.filter,
        sort: this.sort.sort_by('date'),
        page: this.paging.currentPage,
        size: this.paging.pageSize
      });
      this.summarize();
    }

    calcOutcome(home: number, away: number): string {
			if(home > away){
				return 'w';
			}
			if(home < away){
				return 'l';
			}
			if(home === away){
				return 'd';
			}
		}
  }
  

  function isNumber(val: any) {
    // negative or positive
    return /^[-]?\d+$/.test(val);
  }

  angular
    .module('app.predictions')
    .controller('PredictionsController', PredictionsController);
}


