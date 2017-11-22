namespace app.predictions {
  'use strict';

  export class PredictionsController {
    static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory',
      'fixturePredictionService', 'EntitySet', 'Fixture'];

    constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
      private logger: blocks.logger.Logger,
      private leagueSeasonFactory: any,
      private fixturePredictionService: app.core.IFixturePredictionService,
      private EntitySet: any,
      private Fixture: any) {
      this.activate();
    }

    title: string = 'Predictions';
    compressed: any;
    fixtures: any[];
    paging = {
      currentPage: 1,
      maxPagesToShow: 5,
      pageSize: 10
    };
    fixtureSet: any;
    fixtureFilteredCount: number;
    fixtureCount: number;

    activate() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          this.compressed = data;
          this.storage.setItem('compressed-fixtures', data.compressed);
          let fixtures = this.$window.lzwCompress.unpack(data.compressed);
          this.fixtureSet = new this.EntitySet(this.Fixture);
          this.fixtureSet.mapDtoListToContext(fixtures);
          this.fixtures = this.fixtureSet.getAll();
          this.fixtureCount = this.fixtureSet.getCount();
          this.fixtureFilteredCount = this.fixtureSet.getFilteredCount();
          this.leagueSeasonFactory.createLeagueSeason(this.fixtures);
        })
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
          return "showing " + resultStart + " - " + resultEnd + " of " + itemCount;
        }
      });

      Object.defineProperty(this.paging, 'pageCount', {
        get: () => {
          let val = this.fixtureFilteredCount / this.paging.pageSize;
          let pageCount = Math.floor(val);
          if (!isNumber(val)) {
            pageCount += 1;
          }
          return pageCount;
        }
      });
    }

    pageChanged() {

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


