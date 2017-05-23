namespace app.matches {
  'use strict';

  angular
    .module('app.matches')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [
			{
        state: 'app.matches-alt',
        config: {
          url: '/matches?league&season&round',
          templateUrl: 'app/matches/matches.html',
          controller: 'MatchesController',
          controllerAs: 'vm',
          title: 'matches',
					resolve:{
						matches:['$stateParams', 'MatchesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Matches: app.core.IMatchesResource) {
								let {league, season, round} = $stateParams;
                if(league != null && season != null && round != null) {
                  return Matches.forRound(league, season, round);
                }
                return Matches.default();
						}]
					}
        }
      }
    ];
  }
}
