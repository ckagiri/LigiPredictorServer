namespace app {
  'use strict';

  angular.module('app', [
    'app.core',
		'app.directives',
		'app.layout',
		'app.auth',
		'app.admin',
		'admin.leagues',
		'admin.seasons',
		'admin.rounds',
		'admin.fixtures',
		'admin.teams',
		'admin.users',
		'app.matches',
		'app.predictions'
  ]);
}
