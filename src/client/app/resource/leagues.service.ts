namespace app.core {
	'use strict';

	export interface ILeaguesResource extends IResource {
	}

	LeaguesResource.$inject = ['resource'];
	function LeaguesResource (resource: (resourceName: string) => ILeaguesResource) {
		var Leagues: ILeaguesResource = resource("leagues");
		return Leagues;
	}

	angular
		.module('app.core')
		.factory('LeaguesResource', LeaguesResource);
}