namespace app.core {
	'use strict';

	export interface ISeasonsResource extends IResource {
		forLeague(leagueId: string): ng.IPromise<any>;
		getById(leagueId: string, seasonId: string): ng.IPromise<any>;
	}

	SeasonsResource.$inject = ['resource'];
	function SeasonsResource (resource: (resourceName: string) => ISeasonsResource) {
		var Leagues = resource("leagues");
		var Seasons = resource("seasons");
		Seasons.forLeague = function (leagueId: string) {
			return Leagues.getList('/:leagueId/seasons', {leagueId});
  	}
		Seasons.getById = function (leagueId: string, seasonId: string) {
			return Leagues.getOne('/:leagueId/seasons/:seasonId', {leagueId, seasonId});
  	}
		return Seasons;
	}

	angular
		.module('app.core')
		.factory('SeasonsResource', SeasonsResource);
}