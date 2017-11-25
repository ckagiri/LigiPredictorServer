namespace app.core {
  'use strict';

  function factory() {
    class Team { 
      constructor(data:any) {
        angular.extend(this, data)
      }

      id: string;
      name: string;
      slug: string;
      crestUrl: string;
      points: number = 0;

      getPoints() {
        return this.points;
      }

      resetPoints() {
        this.points = 0;
      }

	    addPoints(p: number) {
		    this.points += p;
	    }
      
      getName() {
		    return this.name;
      }
    }
    return Team;
  }

  angular
    .module('app.core')
    .factory('Team', factory);
}