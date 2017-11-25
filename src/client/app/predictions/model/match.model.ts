namespace app.core {
  'use strict';

  function factory() {
    class Match {  
      constructor(data: any) {
        angular.extend(this, data);
        this.initScore();
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
      prediction: any = {};

      assign() {
    		if (this.draw()) {
			    this.homeTeam.addPoints(1);
			    this.awayTeam.addPoints(1);
		    } else if (this.homeWin()) {
			    this.homeTeam.addPoints(3);
			    this.awayTeam.addPoints(0);
		    } else {
			    this.homeTeam.addPoints(0);
		      this.awayTeam.addPoints(3);
		    }
      }
      
      getHomeTeam() {
		    return this.homeTeam;
	    }
      
      getAwayTeam() {
		    return this.awayTeam;
	    }
      
      getHomeScore() {
		    return this.homeScore;
      }
      
      getAwayScore() {
		    return this.awayScore;
	    }

      initScore() {
        this.setScore(this.result.goalsHomeTeam, this.result.goalsAwayTeam);
      }

      initScore1() {
        let homeTeamScore = this.result.goalsHomeTeam || 0;
        let awayTeamScore = this.result.goalsAwayTeam || 0;
        let choice = this.prediction && this.prediction.choice;
        if(choice && !!~choice.goalsHomeTeam) {
          homeTeamScore = choice.goalsHomeTeam;
          awayTeamScore = choice.goalsAwayTeam;
        } 
        this.setScore(homeTeamScore, awayTeamScore);
      }

	    setScore(homeScore: any, awayScore: any) {
		    this.homeScore = homeScore;
		    this.awayScore = awayScore;
	    }

	    draw() {
		    return this.homeScore == this.awayScore;
      }
      
      homeWin() {
		    return this.homeScore > this.awayScore;
      }
    }
    return Match;
  }  

  angular
    .module('app.core')
    .factory('Match', factory);
}