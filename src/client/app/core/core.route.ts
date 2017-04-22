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
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise(otherwise);

		homeRoute.$inject = ['$state'];
		function homeRoute($state: ng.ui.IStateService) {
			$state.go('app.matches');
		}

		notFoundRoute.$inject = ['$state'];
		function notFoundRoute($state: ng.ui.IStateService) {
			$state.go('app.404');
		}

		$urlRouterProvider.when('', homeRoute);		
		$urlRouterProvider.when('/', homeRoute);
		$urlRouterProvider.when('/404', notFoundRoute);
  }
  function getStates() {
    return [
			{
				state: 'xapp',
				config: {
					abstract: true,
 					views: {
						'shell': {
							templateUrl: 'app/layout/shell.out.html'
						}
					}
				}
			},
			{
        state: 'xapp.404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      },
			{
				state: 'admin',
				config: {
					abstract: true,
					url: '/admin',
 					views: {
						'shell': {
							templateUrl: 'app/layout/shell.in.html'
						}
					}
				}
			}, 
			{
        state: 'admin.home',
        config: {
					url: '',
          templateUrl: 'app/admin/leagues/leagues.html',
          controller: 'LeaguesController',
          controllerAs: 'vm',
          title: 'leagues'
        }
      },
			{
        state: 'admin.404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      },
			{
				state: 'app',
				config: {
					abstract: true,
 					views: {
						'shell': {
							templateUrl: 'app/layout/shell.in.html'
						}
					}
				}
			},
			{
        state: 'app.404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      }
    ];
  }
}