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
          url: '/leaderboards',
          templateUrl: 'app/leaderboards/leaderboards.html',
          controller: 'LeaderboardsController',
          controllerAs: 'vm',
          title: 'leaderboards'
        }
      }
    ];
  }
}
