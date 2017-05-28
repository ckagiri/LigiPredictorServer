import {IMatchScore} from './IMatchScore'
class GoalDiffCalculator {
  process(choice: IMatchScore, result: IMatchScore): number {
    let choiceGd = Math.abs(choice.goalsHomeTeam - choice.goalsAwayTeam);
    let resultGd = Math.abs(result.goalsHomeTeam - result.goalsAwayTeam);
    let minGd = Math.min(choiceGd, resultGd);
    if (minGd === 0) {
      minGd = 1;
    }
    let homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
    if(homeGoalsGd === 0) {
      homeGoalsGd = result.goalsHomeTeam;
    } else {
      homeGoalsGd = -homeGoalsGd;
    }
    let awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
    if(awayGoalsGd === 0) {
      awayGoalsGd = result.goalsAwayTeam;
    } else {
      awayGoalsGd = -awayGoalsGd;
    }
    let goalDiff = minGd + homeGoalsGd + awayGoalsGd;
    return goalDiff;
  }
}

export const goalDiffCalculator = new GoalDiffCalculator();