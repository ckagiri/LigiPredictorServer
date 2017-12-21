var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = ['$window', 'Team', 'Season', 'Match', 'Round'];
        function factory($window, Team, Season, Match, Round) {
            var LeagueSeasonFactory = (function () {
                function LeagueSeasonFactory() {
                }
                LeagueSeasonFactory.prototype.createLeagueSeason = function (data, usePredictions, fromRound) {
                    if (usePredictions === void 0) { usePredictions = false; }
                    if (fromRound === void 0) { fromRound = 1; }
                    return this.createSeason(data, usePredictions, fromRound);
                };
                LeagueSeasonFactory.prototype.createSeason = function (data, usePredictions, fromRound) {
                    var teamsDict = this.createTeamsDictionary(data);
                    var roundsDict = this.createRoundsDictionary(data);
                    var roundsPlayed = this.getRoundsPlayed(data);
                    var rounds = [];
                    for (var round in roundsDict) {
                        var matches_1 = [];
                        for (var _i = 0, _a = roundsDict[round]; _i < _a.length; _i++) {
                            var fixture = _a[_i];
                            var homeTeam = teamsDict[fixture.homeTeam.name];
                            var awayTeam = teamsDict[fixture.awayTeam.name];
                            fixture.homeTeam = homeTeam;
                            fixture.awayTeam = awayTeam;
                            var match = new Match(fixture);
                            if (usePredictions && parseInt(round) >= fromRound) {
                                match.initScore1();
                            }
                            matches_1.push(match);
                        }
                        var matchRound = new Round();
                        matchRound.setMatches(matches_1);
                        rounds.push(matchRound);
                    }
                    var season = new Season();
                    season.setTeams(this.getTeamsAsArray(teamsDict));
                    season.setRounds(rounds);
                    season.setRoundsPlayed(roundsPlayed);
                    return season;
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
                LeagueSeasonFactory.prototype.getRoundsPlayed = function (data) {
                    var roundsPlayed = $window._.chain(data)
                        .filter(function (n) { return n.result.goalsHomeTeam != null; })
                        .map(function (n) { return n.round; })
                        .max()
                        .value();
                    return parseInt(roundsPlayed);
                };
                LeagueSeasonFactory.prototype.closestMatchDate = function (data) {
                    var bestDiff = -(new Date(0, 0, 0)).valueOf(), bestDate = data.length - 1, now = Date.now(), currDiff = 0, i;
                    for (i = 0; i < data.length; ++i) {
                        var kickoff = new Date(data[i].date).valueOf();
                        currDiff = Math.abs(kickoff - now);
                        if (currDiff < bestDiff) {
                            bestDiff = currDiff;
                            bestDate = i;
                        }
                    }
                    return data[bestDate].date;
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