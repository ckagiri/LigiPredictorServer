namespace app.core {
	'use strict';

	export interface IRoundsResource extends IResource {
		forSeason(leagueId: string, seasonId: string): ng.IPromise<any>;
	}

	RoundsResource.$inject = ['resource'];
	function RoundsResource (resource: (resourceName: string) => IRoundsResource) {
		var Leagues: ILeaguesResource = resource("leagues");
		var Rounds: IRoundsResource = resource("rounds");
		Rounds.forSeason = function (leagueId: string, seasonId: string) {
			return Leagues.getList('/:leagueId/seasons/:seasonId/rounds', {leagueId, seasonId});
  	}
		return Rounds;
	}

	angular
		.module('app.core')
		.factory('RoundsResource', RoundsResource);
}