var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        function factory() {
            var Match = (function () {
                function Match(data) {
                    this.homeScore = 0;
                    this.awayScore = 0;
                    this.assigned = false;
                    this.prediction = {};
                    angular.extend(this, data);
                    this.initScore();
                }
                Match.prototype.assign = function () {
                    if (this.homeScore == undefined) {
                        return;
                    }
                    else {
                        this.homeTeam.played += 1;
                        this.awayTeam.played += 1;
                    }
                    if (this.draw()) {
                        this.homeTeam.addPoints(1);
                        this.awayTeam.addPoints(1);
                    }
                    else if (this.homeWin()) {
                        this.homeTeam.addPoints(3);
                        this.awayTeam.addPoints(0);
                    }
                    else {
                        this.homeTeam.addPoints(0);
                        this.awayTeam.addPoints(3);
                    }
                    this.homeTeam.goalsFor += this.homeScore;
                    this.homeTeam.goalsAgainst += this.awayScore;
                    this.awayTeam.goalsFor += this.awayScore;
                    this.awayTeam.goalsAgainst += this.homeScore;
                };
                Match.prototype.getHomeTeam = function () {
                    return this.homeTeam;
                };
                Match.prototype.getAwayTeam = function () {
                    return this.awayTeam;
                };
                Match.prototype.getHomeScore = function () {
                    return this.homeScore;
                };
                Match.prototype.getAwayScore = function () {
                    return this.awayScore;
                };
                Match.prototype.initScore = function () {
                    this.setScore(this.result.goalsHomeTeam, this.result.goalsAwayTeam);
                };
                Match.prototype.initScore1 = function () {
                    var homeTeamScore = this.result.goalsHomeTeam;
                    var awayTeamScore = this.result.goalsAwayTeam;
                    var choice = this.prediction && this.prediction.choice;
                    if (choice && !!~choice.goalsHomeTeam) {
                        homeTeamScore = choice.goalsHomeTeam;
                        awayTeamScore = choice.goalsAwayTeam;
                    }
                    this.setScore(homeTeamScore, awayTeamScore);
                };
                Match.prototype.setScore = function (homeScore, awayScore) {
                    this.homeScore = homeScore;
                    this.awayScore = awayScore;
                };
                Match.prototype.draw = function () {
                    return this.homeScore == this.awayScore;
                };
                Match.prototype.homeWin = function () {
                    return this.homeScore > this.awayScore;
                };
                return Match;
            }());
            return Match;
        }
        angular
            .module('app.core')
            .factory('Match', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=match.model.js.map