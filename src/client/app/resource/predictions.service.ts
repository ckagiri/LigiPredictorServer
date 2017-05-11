namespace app.core {
	'use strict';

	export interface IPredictionsResource extends IResource {
	}

	PredictionsResource.$inject = ['resource'];
	function PredictionsResource (resource: (resourceName: string) => IPredictionsResource) {
		var Predictions: IPredictionsResource = resource("leagues");
		return Predictions;
	}

	angular
		.module('app.core')
		.factory('PredictionsResource', PredictionsResource);
}