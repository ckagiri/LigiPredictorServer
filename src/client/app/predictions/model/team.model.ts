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
      played: number = 0;
      points: number = 0;
      goalsFor: number = 0;
      goalsAgainst: number = 0;

      getPoints() {
        return this.points;
      }

      getGoalsFor() {
        return this.goalsFor;
      }

      getGoalsAgainst() {
        return this.goalsAgainst;
      }

      getGoalDiff() {
        return this.goalsFor - this.goalsAgainst;
      }

      getPlayed() {
        return this.played;
      }

      resetPoints() {
        this.points = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;      
        this.played = 0;  
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