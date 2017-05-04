namespace app.core {
	'use strict';

	export interface ISeasonsResource extends IResource {
		forLeague(leagueId: number|string): ng.IPromise<any>;
	}

	SeasonsResource.$inject = ['resource'];
	function SeasonsResource (resource: (resourceName: string) => ISeasonsResource) {
		var Seasons = resource("seasons");
		Seasons.forLeague = function (leagueId: number|string) {
    	return Seasons.query({leagueId});
  	}
		return Seasons;
	}

	angular
		.module('app.core')
		.factory('SeasonsResource', SeasonsResource);
}