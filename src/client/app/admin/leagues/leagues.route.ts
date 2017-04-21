namespace admin.leagues {
  'use strict';

  angular
    .module('admin.leagues')
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
        state: 'admin.leagues',
        config: {
          url: '/leagues',
          templateUrl: 'app/admin/leagues/leagues.html',
          controller: 'LeaguesController',
          controllerAs: 'vm',
          title: 'leagues'
        }
      }
    ];
  }
}
