namespace app.core {
	'use strict';

	export interface IFixturesResource extends IResource {
	}

	FixturesResource.$inject = ['resource'];
	function FixturesResource (resource: (resourceName: string) => IFixturesResource) {
		var Fixtures: IFixturesResource = resource("leagues");
		return Fixtures;
	}

	angular
		.module('app.core')
		.factory('FixturesResource', FixturesResource);
}