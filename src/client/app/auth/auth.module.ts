namespace app.auth {
	'use strict';

	
  config.$inject = ['$authProvider'];
  function config($authProvider: any) {
    $authProvider.google({
      clientId: '878230370671-k3ves4plp9gl7l9fvpvr3pse3mok0f9q.apps.googleusercontent.com'
    });

    $authProvider.facebook({
      clientId: '1895048740742132'
    });
  }

	angular.module('app.auth', ['app.core'])
		.config(config);
}