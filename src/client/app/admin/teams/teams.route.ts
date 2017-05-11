namespace admin.teams {
  'use strict';

  angular
    .module('admin.teams')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'admin.teams',
        config: {
          url: '/teams',
          templateUrl: 'app/admin/teams/teams.html',
          controller: 'TeamsController',
          controllerAs: 'vm',
          title: 'teams',
					resolve:{
						teams:['$stateParams', 'TeamsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Teams: app.core.ITeamsResource) {
								return Teams.forLeague($stateParams.leagueId);
						}]
					}
        }
      },
			{
        state: 'admin.team-edit',
        config: {
          url: '/teams/:teamId',
          templateUrl: 'app/admin/teams/team-detail.html',
          controller: 'TeamsController',
          controllerAs: 'vm',
          title: 'teams',
					resolve:{
						teams:['$stateParams', 'TeamsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Teams: app.core.ITeamsResource) {
								return Teams.getById($stateParams.teamId);
						}]
					}
        }
			},
			{
        state: 'admin.team-matches',
        config: {
          url: '/teams/:teamId/matches',
          templateUrl: 'app/admin/teams/team-matches.html',
          controller: 'TeamMatchesController',
          controllerAs: 'vm',
          title: 'teams',
					resolve:{
						teams:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {leagueId, teamId} = $stateParams;
								return Fixtures.forTeam(teamId);
						}]
					}
        }
			}
    ];
  }
}
