var app;
(function (app) {
    var rules;
    (function (rules_1) {
        'use strict';
        var RulesController = (function () {
            function RulesController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'Rules';
                this.goalsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                this.homeScoreResult = 0;
                this.awayScoreResult = 0;
                this.homeScorePrediction = 0;
                this.awayScorePrediction = 0;
                this.hasJoker = false;
                this.points = {
                    rules: {
                        RULE_1: { id: '1', show: false, value: 0, name: 'Correct Match Outcome' },
                        RULE_2: { id: '2', show: false, value: 0, name: 'Correct Goal Difference' },
                        RULE_3: { id: '3', show: false, value: 0, name: 'Correct Team Score' },
                        RULE_4: { id: '4', show: false, value: 0, name: 'Exact Match Score' },
                        RULE_5: { id: '5', show: false, value: 0, name: 'Team Score of 2 or more' },
                        RULE_6: { id: '6', show: false, value: 0, name: 'Within 1 goal of Match Score' }
                    },
                    value: 0
                };
                this.goalDiff = {
                    rules: {
                        RULE_1: { id: '1', show: false, value: 0, name: 'Correct Team Score (Gain)' },
                        RULE_2: { id: '2', show: false, value: 0, name: 'Incorrect Team Score (Loss)' },
                        RULE_3: { id: '3', show: false, value: 0, name: 'Correct Match Outcome (Bonus)' },
                        RULE_4: { id: '4', show: false, value: 0, name: 'Team Score Within 1 (Insurance)' },
                        RULE_5: { id: '5', show: false, value: 0, name: 'Least of the Goal-Differences (Gain)' }
                    },
                    value: 0
                }; //	RULE_3: {id: 'c', show: false, value: 0, name: 'Correct Outcome, Incorrect Score, And'},
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.activate();
            }
            RulesController.prototype.activate = function () {
                this.defaultPoints = angular.copy(this.points);
                this.defaultGoalDiff = angular.copy(this.goalDiff);
                this.goalsChanged();
            };
            RulesController.prototype.jokerChanged = function () {
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.totalPoints += this.points.value;
                this.totalGoalDiff += this.goalDiff.value;
                if (this.hasJoker && this.goalDiff.value >= 0) {
                    this.totalPoints += this.points.value;
                    this.totalGoalDiff += this.goalDiff.value;
                }
            };
            RulesController.prototype.goalsChanged = function () {
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.points = angular.copy(this.defaultPoints);
                this.goalDiff = angular.copy(this.defaultGoalDiff);
                var predictionOutcome = this.calcOutcome(this.homeScorePrediction, this.awayScorePrediction);
                var resultOutcome = this.calcOutcome(this.homeScoreResult, this.awayScoreResult);
                var predictionGd = this.homeScorePrediction - this.awayScorePrediction;
                var resultGd = this.homeScoreResult - this.awayScoreResult;
                this.processPoints(predictionOutcome, resultOutcome, predictionGd, resultGd);
                this.processGoalDiff(predictionOutcome, resultOutcome, predictionGd, resultGd);
                this.jokerChanged();
            };
            RulesController.prototype.processPoints = function (predictionOutcome, resultOutcome, predictionGd, resultGd) {
                var rules = this.points.rules;
                if (predictionOutcome === resultOutcome) {
                    rules.RULE_1.show = true;
                    rules.RULE_1.value = 4;
                }
                if (predictionGd === resultGd) {
                    rules.RULE_2.show = true;
                    rules.RULE_2.value = 1;
                }
                if (this.homeScorePrediction === this.homeScoreResult) {
                    rules.RULE_3.show = true;
                    rules.RULE_3.value += 1;
                }
                if (this.awayScorePrediction === this.awayScoreResult) {
                    rules.RULE_3.show = true;
                    rules.RULE_3.value += 1;
                }
                if (this.homeScorePrediction === this.homeScoreResult &&
                    this.awayScorePrediction === this.awayScoreResult) {
                    rules.RULE_4.show = true;
                    rules.RULE_4.value = 1;
                }
                if (this.homeScorePrediction > 1 && this.homeScoreResult > 1) {
                    rules.RULE_5.show = true;
                    rules.RULE_5.value += 1;
                }
                if (this.awayScorePrediction > 1 && this.awayScoreResult > 1) {
                    rules.RULE_5.show = true;
                    rules.RULE_5.value += 1;
                }
                if (Math.abs(predictionGd - resultGd) === 1 &&
                    (this.homeScorePrediction === this.homeScoreResult ||
                        this.awayScorePrediction === this.awayScoreResult)) {
                    rules.RULE_6.show = true;
                    rules.RULE_6.value += 1;
                }
                for (var key in rules) {
                    var rule = rules[key];
                    if (rule.show) {
                        this.points.value += rule.value;
                    }
                }
            };
            RulesController.prototype.processGoalDiff = function (predictionOutcome, resultOutcome, predictionGd, resultGd) {
                predictionGd = Math.abs(predictionGd);
                resultGd = Math.abs(resultGd);
                var homeGoalsGd = null;
                var awayGoalsGd = null;
                var minGd = Math.abs(Math.min(predictionGd, resultGd)) || 1;
                var rules = this.goalDiff.rules;
                rules.RULE_5.show = true;
                rules.RULE_5.value = minGd;
                if (predictionOutcome === resultOutcome) {
                    rules.RULE_3.show = true;
                    rules.RULE_3.value = 1;
                    homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
                    awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
                    if (homeGoalsGd === 1) {
                        rules.RULE_2.show = false;
                        rules.RULE_2.value -= 1;
                        rules.RULE_4.show = true;
                        rules.RULE_4.value += 1;
                    }
                    else {
                        homeGoalsGd = null;
                    }
                    if (awayGoalsGd === 1) {
                        rules.RULE_2.show = false;
                        rules.RULE_2.value -= 1;
                        rules.RULE_4.show = true;
                        rules.RULE_4.value += 1;
                    }
                    else {
                        awayGoalsGd = null;
                    }
                }
                if (homeGoalsGd === null) {
                    homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
                    if (homeGoalsGd === 0) {
                        rules.RULE_1.show = true;
                        rules.RULE_1.value += this.homeScoreResult || 1;
                    }
                    else {
                        rules.RULE_2.show = true;
                        rules.RULE_2.value -= homeGoalsGd;
                    }
                }
                if (awayGoalsGd === null) {
                    awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
                    if (awayGoalsGd === 0) {
                        rules.RULE_1.show = true;
                        rules.RULE_1.value += this.awayScoreResult || 1;
                    }
                    else {
                        rules.RULE_2.show = true;
                        rules.RULE_2.value -= awayGoalsGd;
                    }
                }
                for (var key in rules) {
                    var rule = rules[key];
                    this.goalDiff.value += rule.value;
                }
                rules.RULE_2.value += rules.RULE_4.value;
                rules.RULE_4.value = null;
            };
            RulesController.prototype.calcOutcome = function (home, away) {
                if (home > away) {
                    return 'w';
                }
                if (home < away) {
                    return 'l';
                }
                if (home === away) {
                    return 'd';
                }
            };
            return RulesController;
        }());
        RulesController.$inject = ['$q', 'logger'];
        rules_1.RulesController = RulesController;
        angular
            .module('app.rules')
            .controller('RulesController', RulesController);
    })(rules = app.rules || (app.rules = {}));
})(app || (app = {}));
//# sourceMappingURL=rules.controller.js.map