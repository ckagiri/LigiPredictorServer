namespace app.matches {
  'use strict';

  angular
    .module('app.matches')
    .run(appRun);

  appRun.$inject = ['RouterHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'app.matches',
        config: {
          url: '/matches',
          templateUrl: 'app/matches/matches.html',
          controller: 'MatchesController',
          controllerAs: 'vm',
          title: 'matches'
        }
      }
    ];
  }
}
