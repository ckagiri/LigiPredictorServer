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
                        RULE_1: { hasValue: false, value: 0 },
                        RULE_2: { hasValue: false, value: 0 },
                        RULE_3: { hasValue: false, value: 0 },
                        RULE_4: { hasValue: false, value: 0 },
                        RULE_5: { hasValue: false, value: 0 },
                        RULE_6: { hasValue: false, value: 0 }
                    },
                    value: 0
                };
                this.goalDiff = {
                    rules: {
                        RULE_1: { hasValue: false, value: 0 },
                        RULE_2: { hasValue: false, value: 0 },
                        RULE_3_1: { hasValue: false, value: 0 },
                        RULE_3_2: { hasValue: false, value: 0 },
                        RULE_4: { hasValue: false, value: 0 }
                    },
                    value: 0
                };
                this.totalPoints = 0;
                this.totalGoalDiff = 0;
                this.activate();
            }
            RulesController.prototype.activate = function () {
                this.defaultPoints = angular.copy(this.points);
                this.defaultGoalDiff = angular.copy(this.goalDiff);
                this.goalsChanged();
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
                this.totalPoints += this.points.value;
                this.totalGoalDiff += this.goalDiff.value;
                if (this.hasJoker && this.goalDiff.value >= 0) {
                    this.totalPoints += this.points.value;
                    this.totalGoalDiff += this.goalDiff.value;
                }
            };
            RulesController.prototype.processPoints = function (predictionOutcome, resultOutcome, predictionGd, resultGd) {
                var rules = this.points.rules;
                if (predictionOutcome === resultOutcome) {
                    rules.RULE_1.hasValue = true;
                    rules.RULE_1.value = 4;
                }
                if (predictionGd === resultGd) {
                    rules.RULE_2.hasValue = true;
                    rules.RULE_2.value = 1;
                }
                if (this.homeScorePrediction === this.homeScoreResult) {
                    rules.RULE_3.hasValue = true;
                    rules.RULE_3.value += 1;
                }
                if (this.awayScorePrediction === this.awayScoreResult) {
                    rules.RULE_3.hasValue = true;
                    rules.RULE_3.value += 1;
                }
                if (this.homeScorePrediction === this.homeScoreResult &&
                    this.awayScorePrediction === this.awayScoreResult) {
                    rules.RULE_4.hasValue = true;
                    rules.RULE_4.value = 1;
                }
                if (this.homeScorePrediction > 1 && this.homeScoreResult > 1) {
                    rules.RULE_5.hasValue = true;
                    rules.RULE_5.value += 1;
                }
                if (this.awayScorePrediction > 1 && this.awayScoreResult > 1) {
                    rules.RULE_5.hasValue = true;
                    rules.RULE_5.value += 1;
                }
                if (Math.abs(predictionGd - resultGd) === 1 &&
                    (this.homeScorePrediction === this.homeScoreResult ||
                        this.awayScorePrediction === this.awayScoreResult)) {
                    rules.RULE_6.hasValue = true;
                    rules.RULE_6.value += 1;
                }
                for (var key in rules) {
                    var rule = rules[key];
                    if (rule.hasValue) {
                        this.points.value += rule.value;
                    }
                }
            };
            RulesController.prototype.processGoalDiff = function (predictionOutcome, resultOutcome, predictionGd, resultGd) {
                var homeGoalsGd = null;
                var awayGoalsGd = null;
                var minGd = Math.abs(Math.min(predictionGd, resultGd)) || 1;
                var rules = this.goalDiff.rules;
                rules.RULE_4.hasValue = true;
                rules.RULE_4.value = minGd;
                if (predictionOutcome === resultOutcome) {
                    homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
                    awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
                    if (homeGoalsGd > 0 && awayGoalsGd > 0 && predictionGd === resultGd) {
                        rules.RULE_3_2.hasValue = true;
                        rules.RULE_3_2.value = 1;
                    }
                    if (homeGoalsGd === 1) {
                        rules.RULE_2.hasValue = false;
                        rules.RULE_2.value -= 1;
                        rules.RULE_3_1.hasValue = true;
                        rules.RULE_3_1.value += 1;
                    }
                    else {
                        homeGoalsGd = null;
                    }
                    if (awayGoalsGd === 1) {
                        rules.RULE_2.hasValue = false;
                        rules.RULE_2.value -= 1;
                        rules.RULE_3_1.hasValue = true;
                        rules.RULE_3_1.value += 1;
                    }
                    else {
                        awayGoalsGd = null;
                    }
                }
                if (homeGoalsGd === null) {
                    homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
                    if (homeGoalsGd === 0) {
                        rules.RULE_1.hasValue = true;
                        rules.RULE_1.value += this.homeScoreResult || 1;
                    }
                    else {
                        rules.RULE_2.hasValue = true;
                        rules.RULE_2.value -= homeGoalsGd;
                    }
                }
                if (awayGoalsGd === null) {
                    awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
                    if (awayGoalsGd === 0) {
                        rules.RULE_1.hasValue = true;
                        rules.RULE_1.value += this.awayScoreResult || 1;
                    }
                    else {
                        rules.RULE_2.hasValue = true;
                        rules.RULE_2.value -= awayGoalsGd;
                    }
                }
                for (var key in rules) {
                    var rule = rules[key];
                    this.goalDiff.value += rule.value;
                }
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