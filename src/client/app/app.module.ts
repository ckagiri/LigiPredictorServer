namespace app {
  'use strict';

  angular.module('app', [
    'app.core',
		'app.layout',
		'app.auth',
		'app.admin',
		'admin.leagues',
		'app.matches'
  ]);
}
