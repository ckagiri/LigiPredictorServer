namespace admin.seasons {
  'use strict';

  angular
    .module('admin.seasons')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'admin.seasons',
        config: {
          url: '/leagues/:leagueId/seasons',
          templateUrl: 'app/admin/seasons/seasons.html',
          controller: 'SeasonsController',
          controllerAs: 'vm',
          title: 'seasons',
					resolve:{
						seasons:['$stateParams', 'SeasonsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Seasons: app.core.ISeasonsResource) {
								return Seasons.forLeague($stateParams.leagueId);
						}]
					}
        }
      },
			,
			{
        state: 'admin.season-detail',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId',
          templateUrl: 'app/admin/seasons/season-detail.html',
          controller: 'SeasonDetailController',
          controllerAs: 'vm',
          title: 'Season',
					resolve:{
						season:['$stateParams', 'SeasonsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Seasons: app.core.ISeasonsResource) {
								let {leagueId, seasonId} = $stateParams;
								return Seasons.getOne(leagueId, seasonId);
						}]
					}
        }
			},
			{
        state: 'admin.season-fixtures',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/fixtures?round',
          templateUrl: 'app/admin/fixtures/fixtures.html',
          controller: 'FixturesController',
          controllerAs: 'vm',
          title: 'season-Fixtures',
					resolve:{
						fixtures:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {leagueId, seasonId, round} = $stateParams;
								return Fixtures.forRound(leagueId, seasonId, round);
						}]
					}
        }
			},
			{
        state: 'admin.season-rounds',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/rounds',
          templateUrl: 'app/admin/seasons/season-rounds.html',
          controller: 'SeasonRoundsController',
          controllerAs: 'vm',
          title: 'season-Rounds',
					resolve:{
						rounds:['$stateParams', 'RoundsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Rounds: app.core.IRoundsResource) {
								let {leagueId, seasonId} = $stateParams;
								return Rounds.forSeason(leagueId, seasonId);
						}]
					}
        }
			},
			{
        state: 'admin.season-round-fixtures',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures',
          templateUrl: 'app/admin/fixtures/fixtures.html',
          controller: 'FixturesController',
          controllerAs: 'vm',
          title: 'season-Fixtures',
					resolve:{
						fixtures:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {leagueId, seasonId, roundId} = $stateParams;
								return Fixtures.forRound(leagueId, seasonId, roundId);
						}]
					}
        }
			},
			{
        state: 'admin.season-teams',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/teams',
          templateUrl: 'app/admin/seasons/season-teams.html',
          controller: 'SeasonTeamsController',
          controllerAs: 'vm',
          title: 'season-Teams',
					resolve:{
						teams:['$stateParams', 'TeamsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Teams: app.core.ITeamsResource) {
								let {leagueId, seasonId} = $stateParams;
								return Teams.forSeason(leagueId, seasonId);
						}]
					}
        }
			}
    ];
  }
}
