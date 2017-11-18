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
		private COLORS = ['#E33030', '#DB9A9A'];
		private BAR_CHART_OPTIONS = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 450,
        x: function(d: any){ return d.label; },
        y: function(d: any){ return d.value; },
				showValues: true,
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
		allMatchOutcomes: any = {loading: true};
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
                "key": "Series1",
                "color": "#d62728",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : 1.8746444827653
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : 8.0961543492239
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : 0.57072943117674
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : 2.4174010336624
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : 0.72009071426284
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : 0.77154485523777
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : 0.90152097798131
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : 0.91445417330854
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : 0.055746319141851
                    }
                ]
            },
            {
                "key": "Series2",
                "color": "#1f77b4",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : 25.307646510375
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : 16.756779544553
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : 18.451534877007
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : 8.6142352811805
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : 7.8082472075876
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : 5.259101026956
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : 0.30947953487127
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : 0
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