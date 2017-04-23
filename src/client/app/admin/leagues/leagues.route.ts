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
          title: 'leagues'
        }
      }
    ];
  }
}
