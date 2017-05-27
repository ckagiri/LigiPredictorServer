namespace admin.users {
  'use strict';

  angular
    .module('admin.users')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
      {
        state: 'admin.users',
        config: {
          url: '/users',
          templateUrl: 'app/admin/users/users.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          title: 'users',
					resolve:{
						users:['$stateParams', 'UsersResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Users: app.core.IUsersResource) {
								return Users.all();
						}]
					}
        }
      },
			{
        state: 'admin.user-detail',
        config: {
          url: '/users/:id',
          templateUrl: 'app/admin/users/users.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          title: 'users',
					resolve:{
						users:['$stateParams', 'UsersResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Users: app.core.IUsersResource) {
								return Users.getById($stateParams.id);
						}]
					}
        }
			}
    ];
  }
}
