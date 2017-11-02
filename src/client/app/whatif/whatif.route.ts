namespace app.whatif {
  'use strict';

  angular
    .module('app.whatif')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'app.whatif',
        config: {
          url: '/what-if',
          templateUrl: 'app/whatif/whatif.html',
          controller: 'WhatIfController',
          controllerAs: 'vm',
          title: 'whatif'
        }
      }
    ];
  }
}
