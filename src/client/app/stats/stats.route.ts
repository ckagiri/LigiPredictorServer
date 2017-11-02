namespace app.stats {
  'use strict';

  angular
    .module('app.stats')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'app.stats',
        config: {
          url: '/stats',
          templateUrl: 'app/stats/stats.html',
          controller: 'StatsController',
          controllerAs: 'vm',
          title: 'stats'
        }
      }
    ];
  }
}
