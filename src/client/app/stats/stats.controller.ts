namespace app.stats {
  'use strict';

  export class StatsController {
    static $inject: string[] = ['$q', '$window', '_', 'localstorage', 'logger', 'fixturePredictionService'];

    constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
      private _: any,
      private logger: blocks.logger.Logger,
      private fixturePredictionService: app.core.IFixturePredictionService) {
      this.activate();
    }

    title: string = 'Stats';

    compressed: any;
    fixtures: [any];
    private COLORS = ['#1f77b4','#d62728'];
    private BAR_CHART_OPTIONS = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 250,
        x: function (d: any) { return d.label; },
        y: function (d: any) { return d.value; },
        showValues: true,
        showControls: false,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Values'
        },
        color: this.COLORS
      }
    };
    allMatchOutcomes: any = { loading: true };
    matchOutcomeInTeamMatches: any;
    pointsInTeamMatches: any;
    pointsByPoint: any;
    goalDiffByGd: any;

    activate() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          this.compressed = data;
          //this.storage.setItem('compressed-fixtures', data.compressed);
          this.fixtures = this.$window.lzwCompress.unpack(data.compressed);
          this.allMatchOutcomes.options = this.BAR_CHART_OPTIONS;
          this.allMatchOutcomes.loading = false;
          this.allMatchOutcomes.err = null;
          this.allMatchOutcomes.data = [
            {
              "key": "Correct",
              "values": [
                {
                  "label": "Arsenal",
                  "value": 40.5
                },
                {
                  "label": "Liverpool",
                  "value": 55.5
                }
              ]
            },
            {
              "key": "Incorrect",
              "values": [
                {
                  "label": "Arsenal",
                  "value": 59.5
                },
                {
                  "label": "Liverpool",
                  "value": 44.5
                }
              ]
            }]
        })
    }
  }

  angular
    .module('app.stats')
    .controller('StatsController', StatsController);
}