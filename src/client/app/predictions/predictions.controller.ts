namespace app.predictions {
  'use strict';

  export class PredictionsController {
    static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory', 'fixturePredictionService'];

    constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
      private logger: blocks.logger.Logger,
      private leagueSeasonFactory: any,
      private fixturePredictionService: app.core.IFixturePredictionService) {
      this.activate();
    }

    title: string = 'Predictions';
    compressed: any;
    fixtures: [any];
    paging = {
      currentPage: 1,
      maxPagesToShow: 5,
      pageSize: 10
    };

    activate() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          this.compressed = data;
          this.storage.setItem('compressed-fixtures', data.compressed);
          this.fixtures = this.$window.lzwCompress.unpack(data.compressed);
          this.leagueSeasonFactory.createLeagueSeason(this.fixtures);
        })
    }

    init() {
      Object.defineProperty(this.paging, 'showing', {
        get: function () {
          var paging = this.paging,
            itemCount = this.fixtureFilteredCount;
          if (itemCount === 0) {
            return "";
          }
          var resultStart = (paging.currentPage - 1) * paging.pageSize + 1;
          var resultEnd = resultStart + paging.pageSize - 1;
          if (resultEnd > itemCount) {
            resultEnd = itemCount;
          }
          return "showing " + resultStart + " - " + resultEnd + " of " + itemCount;
        }
      });
    }

    pageChanged() {

    }
  }

  angular
    .module('app.predictions')
    .controller('PredictionsController', PredictionsController);
}


