namespace app.core {
  // ((): void => {
  // })();
  // What: Creates an IIFE
  // When: Use when you have no TypeScript components to export
  // Less function wrapping
  'use strict';

  angular
    .module('app.core')
    .config(configureStates)
    .run(appRun);

  appRun.$inject = ['RouterHelper'];
  function appRun(RouterHelper: blocks.router.IRouterHelper) { }

  configureStates.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
  /* @ngInject */
  function configureStates($stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    var otherwise = '/404';
    var states = getStates();
    states.forEach(function(state) {
      $stateProvider.state(state.state, state.config);
    });
    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise(otherwise);

		homeRoute.$inject = ['$state'];
		function homeRoute($state: ng.ui.IStateService) {
			$state.go('app.matches', null, { reload: true });
		}
		$urlRouterProvider.when('', homeRoute);
		
		$urlRouterProvider.when('/', homeRoute);
  }

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      }
    ];
  }
}