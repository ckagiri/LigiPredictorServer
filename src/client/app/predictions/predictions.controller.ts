namespace app.predictions {
	'use strict';

	export class PredictionsController {
		static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'fixturePredictionService'];

		constructor(private $q: ng.IQService,
			private $window: ng.IWindowService,
			private storage: app.core.ILocalStorageService,
      private logger: blocks.logger.Logger,
			private fixturePredictionService: app.core.IFixturePredictionService) {
				this.activate();
    }

		title: string = 'Predictions';
		compressed: any;
		fixtures: [any];

		activate() {
			this.fixturePredictionService.getFixturesWithPredictions()
				.then((data) => {
					this.compressed = data;
					this.storage.setItem('compressed-fixtures', data.compressed);
					this.fixtures = this.$window.lzwCompress.unpack(data.compressed);
				})
		}
	}

	angular
    .module('app.predictions')
    .controller('PredictionsController', PredictionsController);
}