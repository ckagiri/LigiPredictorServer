"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GoalDiffCalculator = (function () {
    function GoalDiffCalculator() {
    }
    GoalDiffCalculator.prototype.process = function (choice, result) {
        var choiceGd = Math.abs(choice.goalsHomeTeam - choice.goalsAwayTeam);
        var resultGd = Math.abs(result.goalsHomeTeam - result.goalsAwayTeam);
        var homeGoalsGd = null;
        var awayGoalsGd = null;
        var correctOutcomeExtra = 0;
        var minGd = Math.min(choiceGd, resultGd) || 1;
        var choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
        var resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
        if (choiceOutcome === resultOutcome) {
            correctOutcomeExtra = 1;
            homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
            awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
            if (homeGoalsGd === 1) {
                homeGoalsGd = 0;
            }
            else {
                homeGoalsGd = null;
            }
            if (awayGoalsGd === 1) {
                awayGoalsGd = 0;
            }
            else {
                awayGoalsGd = null;
            }
        }
        if (homeGoalsGd === null) {
            homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
            if (homeGoalsGd === 0) {
                homeGoalsGd = result.goalsHomeTeam || 1;
            }
            else {
                homeGoalsGd = -homeGoalsGd;
            }
        }
        if (awayGoalsGd === null) {
            awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
            if (awayGoalsGd === 0) {
                awayGoalsGd = result.goalsAwayTeam || 1;
            }
            else {
                awayGoalsGd = -awayGoalsGd;
            }
        }
        var goalDiff = minGd + homeGoalsGd + awayGoalsGd + correctOutcomeExtra;
        return goalDiff;
    };
    return GoalDiffCalculator;
}());
function calcOutcome(home, away) {
    if (home > away) {
        return 'w';
    }
    if (home < away) {
        return 'l';
    }
    if (home === away) {
        return 'd';
    }
}
exports.goalDiffCalculator = new GoalDiffCalculator();
//# sourceMappingURL=goaldiff-calculator.js.map