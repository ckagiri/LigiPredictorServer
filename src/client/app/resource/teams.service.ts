namespace app.core {
	'use strict';

	export interface ITeamsResource extends IResource {
	}

	TeamsResource.$inject = ['resource'];
	function TeamsResource (resource: (resourceName: string) => ITeamsResource) {
		var Teams: ITeamsResource = resource("leagues");
		return Teams;
	}

	angular
		.module('app.core')
		.factory('TeamsResource', TeamsResource);
}