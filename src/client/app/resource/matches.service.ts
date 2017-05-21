namespace app.core {
	'use strict';

	export interface IMatchesResource extends IResource {
		default(): ng.IPromise<any>;
		forRound(leagueId: string, seasonId: string, roundId: string): ng.IPromise<any>;
	}

	MatchesResource.$inject = ['resource'];
	function MatchesResource (resource: (resourceName: string) => IMatchesResource) {
		var Matches: IMatchesResource = resource("matches");
		Matches.default = function() {
			return Matches.all();
		}
		Matches.forRound = function (leagueId: string, seasonId: string, roundId: string) {
			return Matches.getList('?league=:leagueId&season=:seasonId&round=:roundId', 
				{leagueId, seasonId, roundId});
  	}
		return Matches;
	}

	angular
		.module('app.core')
		.factory('MatchesResource', MatchesResource);
}