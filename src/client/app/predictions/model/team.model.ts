namespace app.core {
  'use strict';

  factory.$inject = [];
  function factory() {
    class Team { 
      constructor(data:any) {
        angular.extend(this, data)
      }

      id: string;
      name: string;
      slug: string;
      crestUrl: string;
    }
    return Team;
  }

  angular
    .module('app.core')
    .factory('Team', factory);
}