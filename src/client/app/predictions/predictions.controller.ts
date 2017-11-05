namespace app.predictions {
	'use strict';

	export class PredictionsController {
		static $inject: string[] = ['$q', 'logger', 'fixturePredictionService'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger,
			private fixturePredictionService: app.core.IFixturePredictionService) {
				this.activate();
    }

		title: string = 'Predictions';
		fixtures: [any];

		activate() {
			this.fixturePredictionService.getFixturesWithPredictions()
				.then((data) => {
					this.fixtures = data;
				})
		}
	}

	angular
    .module('app.predictions')
    .controller('PredictionsController', PredictionsController);
}