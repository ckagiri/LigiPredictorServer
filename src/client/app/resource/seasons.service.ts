namespace app.core {
	'use strict';

	export interface ISeasonsResource extends IResource {
		forLeague(leagueId: string): ng.IPromise<any>;
		getOne(leagueId: string, seasonId: string): ng.IPromise<any>;
		default(): ng.IPromise<any>;
	}

	SeasonsResource.$inject = ['resource'];
	function SeasonsResource (resource: (resourceName: string) => IResource) {
		var Leagues = resource("leagues");
		var Resource = resource("seasons");
		var Seasons = resource("seasons") as ISeasonsResource;
		Seasons.default = function() {
			return Resource.getOne('/default');
		}
		Seasons.forLeague = function (leagueId: string) {
			return Leagues.getList('/:leagueId/seasons', {leagueId});
  	}
		Seasons.getOne = function (leagueId: string, seasonId: string) {
			return Leagues.getOne('/:leagueId/seasons/:seasonId', {leagueId, seasonId});
  	}
		return Seasons;
	}

	angular
		.module('app.core')
		.factory('SeasonsResource', SeasonsResource);
}