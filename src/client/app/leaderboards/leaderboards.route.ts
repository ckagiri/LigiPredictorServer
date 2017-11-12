namespace app.leaderboards {
  'use strict';

  angular
    .module('app.leaderboards')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'app.leaderboards',
        config: {
          url: '/leaderboard',
          templateUrl: 'app/leaderboards/leaderboards.html',
          controller: 'LeaderboardsController',
          controllerAs: 'vm',
          title: 'leaderboards',
          resolve:{
            season: ['$stateParams', 'SeasonsResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Seasons: app.core.ISeasonsResource) {
                let {league, season} = $stateParams;
                if(league != null && season != null) {
                  return Seasons.getOne(league, season);
                }
                return Seasons.default();
            }]
          }
        }
      }
    ];
  }
}
