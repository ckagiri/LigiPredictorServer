namespace app.core {
	'use strict';

	export interface IUsersResource extends IResource {
	}

	UsersResource.$inject = ['resource'];
	function UsersResource (resource: (resourceName: string) => IUsersResource) {
		var Users: IUsersResource = resource("leagues");
		return Users;
	}

	angular
		.module('app.core')
		.factory('UsersResource', UsersResource);
}