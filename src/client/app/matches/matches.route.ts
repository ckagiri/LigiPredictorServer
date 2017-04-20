namespace app.matches {
  'use strict';

  angular
    .module('app.matches')
    .config(configureStates);

  configureStates.$inject = ['$stateProvider'];
  /* @ngInject */
  function configureStates($stateProvider: ng.ui.IStateProvider) {
    var states = getStates();
    states.forEach(function(state) {
      $stateProvider.state(state.state, state.config);
    });
  }

  function getStates() {
    return [
      {
        state: 'app.matches',
        config: {
          url: '/matches',
          templateUrl: 'app/matches/matches.html',
          controller: 'MatchesController',
          controllerAs: 'vm',
          title: 'matches'
        }
      }
    ];
  }
}
