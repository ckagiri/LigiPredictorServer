namespace app.core {
  'use strict';

  factory.$inject = [];
  function factory() {
    class Round { 
      constructor(fixtures: any[]) {
        angular.extend(this, fixtures);
      }

      fixtures: any[]
    }
    return Round;
  }

  angular
    .module('app.core')
    .factory('Round', factory);
}