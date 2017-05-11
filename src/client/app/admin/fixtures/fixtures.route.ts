namespace admin.fixtures {
  'use strict';

  angular
    .module('admin.fixtures')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  function appRun(routerHelper: blocks.router.IRouterHelper) { 
		var states = getStates();
		routerHelper.configureStates(states);
	}

  function getStates() {
    return [      			
			{
        state: 'admin.fixtures',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures',
          templateUrl: 'app/admin/fixtures/fixtures.html',
          controller: 'FixturesController',
          controllerAs: 'vm',
          title: 'fixtures',
					resolve:{
						fixtures:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {leagueId, seasonId, roundId} = $stateParams;
								return Fixtures.forRound(leagueId, seasonId, roundId);
						}]
					}
        }
      },
			{
        state: 'admin.fixtures-alt',
        config: {
          url: '/fixtures?league&season&round',
          templateUrl: 'app/admin/fixtures/fixtures.html',
          controller: 'FixturesController',
          controllerAs: 'vm',
          title: 'fixtures',
					resolve:{
						fixtures:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {league, season, round} = $stateParams;
								return Fixtures.forRound(league, season, round);
						}]
					}
        }
      },
			{
        state: 'admin.fixture-detail',
        config: {
          url: '/leagues/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures/:fixtureId',
          templateUrl: 'app/admin/fixtures/fixtures.html',
          controller: 'FixturesController',
          controllerAs: 'vm',
          title: 'fixtures',
					resolve:{
						fixtures:['$stateParams', 'FixturesResource', 
							function ($stateParams: ng.ui.IStateParamsService, 
								Fixtures: app.core.IFixturesResource) {
								let {leagueId, seasonId, roundId, fixtureId} = $stateParams;
								return Fixtures.getOne(leagueId, seasonId, roundId, fixtureId);
						}]
					}
        }
			}
    ];
  }
}
