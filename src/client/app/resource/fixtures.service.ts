namespace app.core {
	'use strict';

	export interface IFixturesResource extends IResource {
		forRound(leagueId: string, seasonId: string, roundId: string): ng.IPromise<any>;
		forTeam(leagueId: string, seasonId: string, teamId: string): ng.IPromise<any>;
		getOne(leagueId: string, seasonId: string, roundId: string, fixtureId: string): ng.IPromise<any>;
	}

	FixturesResource.$inject = ['resource'];
	function FixturesResource (resource: (resourceName: string) => IFixturesResource) {
		var Leagues: ILeaguesResource = resource("leagues");
		var Fixtures: IFixturesResource = resource("fixtures");
		Fixtures.forRound = function (leagueId: string, seasonId: string, roundId: string) {
			return Leagues.getList('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures', {leagueId, seasonId, roundId});
  	}
		Fixtures.forTeam = function (leagueId: string, seasonId: string, teamId: string) {
			return Leagues.getList('/:leagueId/seasons/:seasonId/teams/:teamId/fixtures', {leagueId, seasonId, teamId});
  	}
		Fixtures.getOne = function (leagueId: string, seasonId: string, roundId: string, fixtureId: string) {
			return Leagues.getOne('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures/:fixtureId', 
				{leagueId, seasonId, roundId, fixtureId});
  	}
		return Fixtures;
	}

	angular
		.module('app.core')
		.factory('FixturesResource', FixturesResource);
}