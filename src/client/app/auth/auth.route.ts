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
        state: 'xapp.login',
        config: {
          url: '/login',
          templateUrl: 'app/auth/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          title: 'login'
        }
      },
			{
        state: 'xapp.signup',
        config: {
          url: '/signup',
          templateUrl: 'app/auth/signup.html',
          controller: 'SignupController',
          controllerAs: 'vm',
          title: 'Signup'
        }
      }
    ];
  }
}