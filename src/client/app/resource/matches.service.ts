namespace app.core {
	'use strict';

	export interface IMatchesResource extends IResource {
		forRound(leagueId: string, seasonId: string, roundId: string): ng.IPromise<any>;
	}

	MatchesResource.$inject = ['resource'];
	function MatchesResource (resource: (resourceName: string) => IMatchesResource) {
		var Leagues: ILeaguesResource = resource("leagues");
		var Matches: IMatchesResource = resource("matches");
		Matches.forRound = function (leagueId: string, seasonId: string, roundId: string) {
			return Leagues.getList('/:leagueId/seasons/:seasonId/rounds/:roundId/matches', {leagueId, seasonId, roundId});
  	}
		return Matches;
	}

	angular
		.module('app.core')
		.factory('MatchesResource', MatchesResource);
}