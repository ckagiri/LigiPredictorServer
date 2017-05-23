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
		Matches.forRound = function (league: string, season: string, round: string) {
			return Matches.getList('?league=:league&season=:season&round=:round', {
				league, season, round
			});
  	}

		return Matches;
	}

	angular
		.module('app.core')
		.factory('MatchesResource', MatchesResource);
}