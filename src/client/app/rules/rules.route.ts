namespace app.rules {
  'use strict';

  angular
    .module('app.rules')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'app.rules',
        config: {
          url: '/rules',
          templateUrl: 'app/rules/rules.html',
          controller: 'RulesController',
          controllerAs: 'vm',
          title: 'rules'
        }
      }
    ];
  }
}
