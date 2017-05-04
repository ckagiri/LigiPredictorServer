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
      }
    ];
  }
}
