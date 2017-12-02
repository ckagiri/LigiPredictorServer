namespace app.core {
  'use strict';

  factory.$inject = ['$window', 'Team', 'Season', 'Match', 'Round']
  function factory($window: ng.IWindowService, Team: any, Season: any, Match: any, Round: any) {
    class LeagueSeasonFactory {
      createLeagueSeason(data: any, usePredictions = false) {
        return this.createSeason(data, usePredictions)
      }

      createSeason(data: any, usePredictions: boolean) {
        let teamsDict: any = this.createTeamsDictionary(data);
        let roundsDict: any = this.createRoundsDictionary(data);
        let roundsPlayed: number = this.getRoundsPlayed(data);
        let rounds = [];
        for (let round in roundsDict) {
          let matches = [];
          for (let fixture of roundsDict[round]) {
            let homeTeam = teamsDict[fixture.homeTeam.name];
            let awayTeam = teamsDict[fixture.awayTeam.name];
            fixture.homeTeam = homeTeam;
            fixture.awayTeam = awayTeam;
            let match = new Match(fixture);
            if(usePredictions) {
              match.initScore1();
            }
            matches.push(match);
          }
          let matchRound = new Round();
          matchRound.setMatches(matches);
          rounds.push(matchRound);
        }
        let season = new Season();
        season.setTeams(this.getTeamsAsArray(teamsDict));
        season.setRounds(rounds);
        season.setRoundsPlayed(roundsPlayed);

        return season;
      }

      createTeamsDictionary(data: any) {
        let teamsDict: any = {};
        for (let match of data) {
          let homeTeam = new Team(match.homeTeam); // id,name,slug,crestUrl
          let awayTeam = new Team(match.awayTeam);
          teamsDict[match.homeTeam.name] = homeTeam;
          teamsDict[match.awayTeam.name] = awayTeam;
        }
        return teamsDict;
      }

      createRoundsDictionary(data: any) {
        let roundsDict = data.reduce((acc: any, n: any) => {
          acc[n.round] = acc[n.round] || [];
          acc[n.round].push(n);
          return acc;
        }, Object.create(null));
        return roundsDict;
      }

      getTeamsAsArray(teamsDict: any) {
        let teams = [];
        for (let teamKey in teamsDict) {
          teams.push(teamsDict[teamKey]);
        }
        return teams;
      }

      getRoundsPlayed(data: any) {
        let roundsPlayed = $window._.chain(data)
          .filter((n: any) => n.result.goalsHomeTeam != null)
          .map((n: any) => n.round)
          .max()
          .value();
        return roundsPlayed;
      }
    }

    return new LeagueSeasonFactory();
  }

  angular
    .module('app.core')
    .factory('leagueSeasonFactory', factory);
}