"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GoalDiffCalculator = (function () {
    function GoalDiffCalculator() {
    }
    GoalDiffCalculator.prototype.process = function (choice, result) {
        var choiceGd = Math.abs(choice.goalsHomeTeam - choice.goalsAwayTeam);
        var resultGd = Math.abs(result.goalsHomeTeam - result.goalsAwayTeam);
        var minGd = Math.min(choiceGd, resultGd);
        if (minGd === 0) {
            minGd = 1;
        }
        var homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
        if (homeGoalsGd === 0) {
            homeGoalsGd = result.goalsHomeTeam || 1;
        }
        else {
            homeGoalsGd = -homeGoalsGd;
        }
        var awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
        if (awayGoalsGd === 0) {
            awayGoalsGd = result.goalsAwayTeam || 1;
        }
        else {
            awayGoalsGd = -awayGoalsGd;
        }
        var goalDiff = minGd + homeGoalsGd + awayGoalsGd;
        return goalDiff;
    };
    return GoalDiffCalculator;
}());
exports.goalDiffCalculator = new GoalDiffCalculator();
//# sourceMappingURL=goaldiff-calculator.js.map