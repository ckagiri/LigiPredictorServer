namespace app.core {
  'use strict';

  factory.$inject = ['Team', 'League', 'Season', 'Match', 'Round']
  function factory(Team: any, League: any, Season: any, Match: any, Round: any) {
    class LeagueSeasonFactory {
      createLeagueSeason(data:any) {
        return this.createSeason(data)
      }

      createSeason(data: any) {
        let teamsDict: any = this.createTeamsDictionary(data);
        let roundsDict: any = this.createRoundsDictionary(data);
        let rounds = [];
        for (let round in roundsDict) {
          let matches = [];
          for (let fixture of roundsDict[round]) {
            let homeTeam = teamsDict[fixture.homeTeam.name];
            let awayTeam = teamsDict[fixture.awayTeam.name];
            fixture.homeTeam = homeTeam;
            fixture.awayTeam = awayTeam;
            let match = new Match(fixture);
            matches.push(fixture);
          }
          rounds.push(new Round(matches));
        }
        let season = new Season(rounds);
        season.setTeams(this.getTeamsAsArray(teamsDict));
        return new League(season);
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
    }

    return new LeagueSeasonFactory();
  }

  angular
    .module('app.core')
    .factory('leagueSeasonFactory', factory);
}