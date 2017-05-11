namespace app.predictions {
	'use strict';

	export class PredictionsController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'Predictions';
	}

	angular
    .module('app.predictions')
    .controller('PredictionsController', PredictionsController);
}