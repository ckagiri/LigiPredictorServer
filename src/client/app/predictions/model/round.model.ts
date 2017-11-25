namespace app.core {
  'use strict';

  function factory() {
    class Round { 
      constructor(data: any) {
        angular.extend(this, data);
      }

      matches: any[];

      setMatches(matches: any[]) {
        this.matches = matches;
      }

      getMatches() {
        return this.matches;
      }

      assign() {
        for (let i = 0; i < this.matches.length; i++) {
			    let match = this.matches[i];
			    match.assign();
		    }
      }
    }
    return Round;
  }

  angular
    .module('app.core')
    .factory('Round', factory);
}