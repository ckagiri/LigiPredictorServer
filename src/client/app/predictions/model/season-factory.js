var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = ['Team', 'League', 'Season', 'Fixture', 'Round'];
        function factory(Team, League, Season, Fixture, Round) {
            var LeagueSeasonFactory = (function () {
                function LeagueSeasonFactory() {
                }
                LeagueSeasonFactory.prototype.createLeagueSeason = function (data) {
                    return this.createSeason(data);
                };
                LeagueSeasonFactory.prototype.createSeason = function (data) {
                    var teamsDict = this.createTeamsDictionary(data);
                    var roundsDict = this.createRoundsDictionary(data);
                    var rounds = [];
                    for (var round in roundsDict) {
                        var fixtures = [];
                        for (var _i = 0, _a = roundsDict[round]; _i < _a.length; _i++) {
                            var match = _a[_i];
                            var homeTeam = teamsDict[match.homeTeam.name];
                            var awayTeam = teamsDict[match.awayTeam.name];
                            match.homeTeam = homeTeam;
                            match.awayTeam = awayTeam;
                            fixtures.push(new Fixture(match));
                        }
                        rounds.push(new Round(fixtures));
                    }
                    var season = new Season(rounds);
                    season.setTeams(this.getTeamsAsArray(teamsDict));
                    return new League(season);
                };
                LeagueSeasonFactory.prototype.createTeamsDictionary = function (data) {
                    var teamsDict = {};
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var match = data_1[_i];
                        var homeTeam = new Team(match.homeTeam); // id,name,slug,crestUrl
                        var awayTeam = new Team(match.awayTeam);
                        teamsDict[match.homeTeam.name] = homeTeam;
                        teamsDict[match.awayTeam.name] = awayTeam;
                    }
                    return teamsDict;
                };
                LeagueSeasonFactory.prototype.createRoundsDictionary = function (data) {
                    var roundsDict = data.reduce(function (acc, n) {
                        acc[n.round] = acc[n.round] || [];
                        acc[n.round].push(n);
                        return acc;
                    }, Object.create(null));
                    return roundsDict;
                };
                LeagueSeasonFactory.prototype.getTeamsAsArray = function (teamsDict) {
                    var teams = [];
                    for (var teamKey in teamsDict) {
                        teams.push(teamsDict[teamKey]);
                    }
                    return teams;
                };
                return LeagueSeasonFactory;
            }());
            return new LeagueSeasonFactory();
        }
        angular
            .module('app.core')
            .factory('leagueSeasonFactory', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=season-factory.js.map