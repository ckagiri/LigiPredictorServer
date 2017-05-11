namespace app.core {
	'use strict';

	export interface IRoundsResource extends IResource {
	}

	RoundsResource.$inject = ['resource'];
	function RoundsResource (resource: (resourceName: string) => IRoundsResource) {
		var Rounds: IRoundsResource = resource("leagues");
		return Rounds;
	}

	angular
		.module('app.core')
		.factory('RoundsResource', RoundsResource);
}