namespace app.core {
  'use strict';

  function factory() {
    class Match {  
      constructor(data: any) {
        angular.extend(this, data);
      }

      homeScore:number = 0;
      awayScore:number = 0;
      homeTeam: any;
      awayTeam: any;
      assigned: boolean = false;
      result: any;
      date: any;
      season: any;
      round: any;
      slug: any;
      status: any;      
      nullo: any;

      assign() {}
      setScore() {}
      getHomeTeam() {}
      getAwayTeam() {}
      getHomeScore() {}
      getAwayScore() {}
    }
    return Match;
  }  

  angular
    .module('app.core')
    .factory('Match', factory);
}