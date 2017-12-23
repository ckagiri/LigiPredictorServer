namespace app.core {
  'use strict';

  function factory() {
    class Season { 
      constructor(data: any) {
        angular.extend(this, data);
      }

      currentRoundNumber: number = 1;
      roundsPlayed: number = 0;
      rounds: any[];
      teams: any[];

      getTeams() {
        return this.teams;
      }

      setTeams(teams: any) {
        this.teams = teams;
      }

      sortStandings() {
        this.teams.sort((a, b) => {
          if (a.getPoints() !== b.getPoints()) { return b.getPoints() - a.getPoints(); } // Compare points
          let diff = (b.getGoalsFor() [3] - b.getGoalsAgainst()) - (a.getGoalsFor() - a.getGoalsAgainst()); // Goal difference
          return diff !== 0 ? diff : b.getGoalsFor() - a.getGoalsFor();  // Compare goal difference or goals
        });
      }

      setRoundsPlayed(rounds: number) {
        this.roundsPlayed = rounds;
        this.setCurrentRound(rounds);
      }

      setRounds(rounds: any[]) {
        this.rounds = rounds;
      }

      getRounds() {
        return this.rounds;
      }

      nextRound() {
        if(this.hasNextRound()) {
          let newRound = this.currentRoundNumber += 1;
          this.setCurrentRound(newRound)
        }        
      }

      prevRound() {
        if(this.hasPrevRound()) {
          let newRound = this.currentRoundNumber -= 1;
          this.setCurrentRound(newRound)
        }        
      }

      setCurrentRound(roundNumber: number){
        if(roundNumber <= this.roundsPlayed) {
          for (let i = 0; i < this.teams.length; i++) {
            let team = this.teams[i];
            team.resetPoints();
          }
          for(let i = 0; i < roundNumber; i++) {
            let round = this.rounds[i];
            round.assign();
          }
          this.currentRoundNumber = roundNumber;
          this.sortStandings();
        }
      }

      getCurrentRound() {
        return this.rounds[this.currentRoundNumber - 1];
      }

      hasPrevRound() {
        return this.currentRoundNumber > 1;  
      }

      hasNextRound() {
        return this.currentRoundNumber < this.rounds.length;
      }

      isLastRound() {
        return this.currentRoundNumber == this.rounds.length;
      }

      isLastRoundPlayed() {
        return this.currentRoundNumber == this.roundsPlayed;
      }

      isFirstRound() {
        return this.currentRoundNumber == 1;
      }

      assign() {
        this.setCurrentRound(this.currentRoundNumber);
      }
    }
    return Season;
  }

  angular
    .module('app.core')
    .factory('Season', factory);
}