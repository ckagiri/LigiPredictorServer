namespace app.auth {
	'use strict';

	angular
		.module('app.auth')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
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