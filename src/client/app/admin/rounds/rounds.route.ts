namespace admin.rounds {
  'use strict';

  angular
    .module('admin.rounds')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [      			
			{
        state: 'admin.rounds',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/rounds',
          templateUrl: 'app/admin/rounds/rounds.html',
          controller: 'RoundsController',
          controllerAs: 'vm',
          title: 'rounds',
					resolve:{
						rounds:['$stateParams', 'RoundsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Rounds: app.core.IRoundsResource) {
								let {leagueId, seasonId} = $stateParams;
								return Rounds.forSeason(leagueId, seasonId);
						}]
					}
        }
      }
    ];
  }
}
