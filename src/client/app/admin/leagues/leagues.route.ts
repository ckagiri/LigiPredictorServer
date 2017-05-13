namespace admin.leagues {
  'use strict';

  angular
    .module('admin.leagues')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'admin.leagues',
        config: {
          url: '/leagues',
          templateUrl: 'app/admin/leagues/leagues.html',
          controller: 'LeaguesController',
          controllerAs: 'vm',
          title: 'leagues',
					resolve:{
						leagues:['LeaguesResource', function (Leagues: app.core.ILeaguesResource) {
							return Leagues.all();
						}]
					}
        }
      },
			{
        state: 'admin.league-detail',
        config: {
          url: '/leagues/:leagueId',
          templateUrl: 'app/admin/leagues/league-detail.html',
          controller: 'LeagueDetailController',
          controllerAs: 'vm',
          title: 'League',
					resolve:{
						league:['$stateParams', 'LeaguesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Leagues: app.core.ILeaguesResource) {
								return Leagues.getById($stateParams.leagueId);
						}]
					}
        }
			}
    ];
  }
}
