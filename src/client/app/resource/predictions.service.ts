namespace app.core {
	'use strict';

	export interface IPredictionsResource extends IResource {
	}

	PredictionsResource.$inject = ['resource'];
	function PredictionsResource (resource: (resourceName: string) => IPredictionsResource) {
		var Predictions: IPredictionsResource = resource("predictions");
		return Predictions;
	}

	angular
		.module('app.core')
		.factory('PredictionsResource', PredictionsResource);
}