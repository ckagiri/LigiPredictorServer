"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PointsCalculator = /** @class */ (function () {
    function PointsCalculator() {
    }
    PointsCalculator.prototype.process = function (choice, result) {
        var scorePoints = {
            matchOutcome: 0,
            goalDifference: 0,
            teamScore: 0,
            matchScore: 0,
            teamScoreOfTwoOrMore: 0,
            plusOrMinusOneGoal: 0
        };
        var choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
        var resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
        if (choiceOutcome === resultOutcome) {
            scorePoints.matchOutcome = 4;
        }
        var choiceGd = choice.goalsHomeTeam - choice.goalsAwayTeam;
        var resultGd = result.goalsHomeTeam - result.goalsAwayTeam;
        if (choiceGd === resultGd) {
            scorePoints.goalDifference = 1;
        }
        if (choice.goalsHomeTeam === result.goalsHomeTeam) {
            scorePoints.teamScore += 1;
        }
        if (choice.goalsAwayTeam === result.goalsAwayTeam) {
            scorePoints.teamScore += 1;
        }
        if (choice.goalsHomeTeam === result.goalsHomeTeam &&
            choice.goalsAwayTeam === result.goalsAwayTeam) {
            scorePoints.matchScore = 1;
        }
        if (choice.goalsHomeTeam > 1 && result.goalsHomeTeam > 1) {
            scorePoints.teamScoreOfTwoOrMore += 1;
        }
        if (choice.goalsAwayTeam > 1 && result.goalsAwayTeam > 1) {
            scorePoints.teamScoreOfTwoOrMore += 1;
        }
        if (Math.abs(choiceGd - resultGd) === 1 &&
            (choice.goalsHomeTeam === result.goalsHomeTeam ||
                choice.goalsAwayTeam === result.goalsAwayTeam)) {
            scorePoints.plusOrMinusOneGoal = 1;
        }
        return scorePoints;
    };
    return PointsCalculator;
}());
exports.pointsCalculator = new PointsCalculator();
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
//# sourceMappingURL=points-calculator.js.map