namespace app.core {
  // ((): void => {
  // })();
  // What: Creates an IIFE
  // When: Use when you have no TypeScript components to export
  // Less function wrapping
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
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
					},
					resolve: {
						admin: ['securityService', function(security: app.auth.SecurityService) {
							return security.requireAdminUser();
						}]
					}
				}
			}, 
			{
        state: 'admin.index',
        config: {
					url: '',
          templateUrl: 'app/admin/leagues/leagues.html',
          controller: 'LeaguesController',
          controllerAs: 'vm',
          title: 'leagues',
					resolve:{
						leagues:['LeaguesResource', function (Leagues: app.core.ILeaguesResource) {
							return Leagues.all();
						}]
					}
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
				url: '/',
				config: {
					abstract: true,
 					views: {
						'shell': {
							templateUrl: 'app/layout/shell.in.html'
						}
					},
					resolve: {
						currentUser: ['securityService', function(security: app.auth.SecurityService) {
							return security.requireAuthenticatedUser();
						}]
					}
				}
			},
			{
				state: 'app.index',
				config: {
          url: '/matches',
          templateUrl: 'app/matches/matches.html',
          controller: 'MatchesController',
          controllerAs: 'vm',
          title: 'matches',
          resolve:{
						matches:['MatchesResource', 
							function (Matches: app.core.IMatchesResource) {
								return Matches.default();
						}]
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
    ]
  }
}