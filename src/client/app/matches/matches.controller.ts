namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', 'matches', 'logger', 'PredictionsResource'];

		constructor(private $q: ng.IQService,
			private fixtures: app.core.IResource,
      private logger: blocks.logger.Logger,
			private Predictions: app.core.IPredictionsResource) {
    }

		title: string = 'Matches';
		predictions: any = {};
		error: any;
		matchday: number = 1;

		createPredictions = () => {
			// var predictions = new Predictions($scope.predictions);
			// predictions.$save(function(response: any){
			// 	this.fixtures = Predictions.query();
			// }, function(errorResponse: any) {
			// 	this.error = errorResponse.data.message;
			// });
		};

		score = (match: any, side: string, change: number) => {
			this.predictions[match] = this.predictions[match] || {};
			var goals = this.predictions[match]['goals'+side+'Team'] || 0;
			if (!(goals === 0 && change === -1)){
				goals += change;
			}
			this.predictions[match]['goals'+side+'Team'] = goals;
		};

		pointsClass(points: any) {
			if(points === 3) {
				return 'label-success';
			} else if (points === 2) {
				return 'label-warning';
			} else {
				return 'label-danger';
			}
		};

		nextMatchday() {
			this.matchday += 1;
		}

		prevMatchday() {
			this.matchday -= 1;
		}

		currMatchday() {
			this.matchday = 1;
		}
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}