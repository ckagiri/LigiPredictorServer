namespace app.core {
  'use strict';

  function factory() {
    class Season { 
      constructor(rounds: any[]) {
        angular.extend(this, rounds)
      }
      rounds: any[];
      getTeams() {

      }
      setTeams() {

      }
      sortStandings() {

      }

      assign() {
        
      }
    }
    return Season;
  }

  angular
    .module('app.core')
    .factory('Season', factory);
}