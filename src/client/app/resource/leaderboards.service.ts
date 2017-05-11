namespace app.core {
	'use strict';

	export interface ILeaderBoardsResource extends IResource {
	}

	LeaderBoardsResource.$inject = ['resource'];
	function LeaderBoardsResource (resource: (resourceName: string) => ILeaderBoardsResource) {
		var LeaderBoards: ILeaderBoardsResource = resource("leagues");
		return LeaderBoards;
	}

	angular
		.module('app.core')
		.factory('LeaderBoardsResource', LeaderBoardsResource);
}