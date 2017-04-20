namespace app.auth {
	'use strict';

	angular
		.module('app.auth')
		.config(configureStates);

	configureStates.$inject = ['$stateProvider'];

	function configureStates($stateProvider: ng.ui.IStateProvider) {
		var states = getStates();
    states.forEach(function(state) {
      $stateProvider.state(state.state, state.config);
    });
	}

	function getStates() {
    return [
			{
				state: 'admin',
				config: {
					abstract: true,
					template: '<div ui-view class="shuffle-animation"></div>'
				}
			}, 
			{
        state: 'admin.home',
        config: {
          url: '/admin',
          templateUrl: 'app/admin/leagues/leagues.html',
          controller: 'LeaguesController',
          controllerAs: 'vm',
          title: 'leagues'
        }
      },
			{
				state: 'app',
				config: {
					abstract: true,
					template: '<div ui-view class="shuffle-animation"></div>'
				}
			},
			{
        state: 'app.home',
        config: {
          url: '/',
          templateUrl: 'app/matches/matches.html',
          controller: 'MatchesController',
          controllerAs: 'vm',
          title: 'matches'
        }
      }
    ];
  }
}