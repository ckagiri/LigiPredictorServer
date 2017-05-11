namespace app.core {
	'use strict';

	export interface ITeamsResource extends IResource {
		forSeason(leagueId: string, seasonId: string): ng.IPromise<any>;
	}

	TeamsResource.$inject = ['resource'];
	function TeamsResource (resource: (resourceName: string) => ITeamsResource) {
		var Leagues: ILeaguesResource = resource("leagues");
		var Teams: ITeamsResource = resource("teams");
		Teams.forSeason = function (leagueId: string, seasonId: string) {
			return Leagues.getList('/:leagueId/seasons/:seasonId/teams', {leagueId, seasonId});
  	}
		return Teams;	
	}

	angular
		.module('app.core')
		.factory('TeamsResource', TeamsResource);
}