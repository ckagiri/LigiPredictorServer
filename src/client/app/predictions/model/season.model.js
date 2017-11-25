var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Season = (function () {
                function Season(data) {
                    this.currentRoundNumber = 1;
                    this.roundsPlayed = 0;
                    angular.extend(this, data);
                }
                Season.prototype.getTeams = function () {
                    return this.teams;
                };
                Season.prototype.setTeams = function (teams) {
                    this.teams = teams;
                };
                Season.prototype.sortStandings = function () {
                    this.teams.sort(function (a, b) {
                        return b.getPoints() - a.getPoints();
                    });
                };
                Season.prototype.setRoundsPlayed = function (rounds) {
                    this.roundsPlayed = rounds;
                    this.setCurrentRound(rounds);
                };
                Season.prototype.setRounds = function (rounds) {
                    this.rounds = rounds;
                };
                Season.prototype.getRounds = function () {
                    return this.rounds;
                };
                Season.prototype.nextRound = function () {
                    if (this.hasNextRound()) {
                        var newRound = this.currentRoundNumber += 1;
                        this.setCurrentRound(newRound);
                    }
                };
                Season.prototype.prevRound = function () {
                    if (this.hasPrevRound()) {
                        var newRound = this.currentRoundNumber -= 1;
                        this.setCurrentRound(newRound);
                    }
                };
                Season.prototype.setCurrentRound = function (roundNumber) {
                    if (roundNumber <= this.roundsPlayed) {
                        for (var i = 0; i < this.teams.length; i++) {
                            var team = this.teams[i];
                            team.resetPoints();
                        }
                        for (var i = 0; i < roundNumber; i++) {
                            var round = this.rounds[i];
                            round.assign();
                        }
                        this.currentRoundNumber = roundNumber;
                        this.sortStandings();
                    }
                };
                Season.prototype.getCurrentRound = function () {
                    return this.rounds[this.currentRoundNumber - 1];
                };
                Season.prototype.hasPrevRound = function () {
                    return this.currentRoundNumber > 1;
                };
                Season.prototype.hasNextRound = function () {
                    return this.currentRoundNumber < this.rounds.length;
                };
                Season.prototype.isLastRound = function () {
                    return this.currentRoundNumber == this.rounds.length;
                };
                Season.prototype.isLastRoundPlayed = function () {
                    return this.currentRoundNumber == this.roundsPlayed;
                };
                Season.prototype.isFirstRound = function () {
                    return this.currentRoundNumber == 1;
                };
                Season.prototype.assign = function () {
                    this.setCurrentRound(this.currentRoundNumber);
                };
                return Season;
            }());
            return Season;
        }
        angular
            .module('app.core')
            .factory('Season', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=season.model.js.map