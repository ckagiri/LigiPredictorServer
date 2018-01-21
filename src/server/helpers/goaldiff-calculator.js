"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GoalDiffCalculator = (function () {
    function GoalDiffCalculator() {
    }
    GoalDiffCalculator.prototype.process = function (choice, result) {
        var defaultGd = 2;
        var homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
        var awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
        if (homeGoalsGd === 0) {
            homeGoalsGd = result.goalsHomeTeam || 1;
        }
        else {
            homeGoalsGd = -homeGoalsGd;
        }
        if (awayGoalsGd === 0) {
            awayGoalsGd = result.goalsAwayTeam || 1;
        }
        else {
            awayGoalsGd = -awayGoalsGd;
        }
        var goalDiff = defaultGd + homeGoalsGd + awayGoalsGd;
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