import {IMatchScore} from './contracts'
class GoalDiffCalculator {
  process(choice: IMatchScore, result: IMatchScore): number {
    let choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
    let resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
    let choiceGd = Math.abs(choice.goalsHomeTeam - choice.goalsAwayTeam);
    let resultGd = Math.abs(result.goalsHomeTeam - result.goalsAwayTeam);
    let minGd = Math.min(choiceGd, resultGd);
    if (minGd === 0) {
      minGd = 1;
    }
    let homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);

    if(homeGoalsGd === 0) {
      homeGoalsGd = result.goalsHomeTeam || 1;
    } else {
      homeGoalsGd = -homeGoalsGd;
    }
    let awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
    if(awayGoalsGd === 0) {
      awayGoalsGd = result.goalsAwayTeam || 1;
    } else {
      awayGoalsGd = -awayGoalsGd;
    }
    if(Math.abs(choiceGd - resultGd) === 1 && 
      (choice.goalsHomeTeam === result.goalsHomeTeam || 
        choice.goalsAwayTeam === result.goalsAwayTeam)) {
        //scorePoints.plusOrMinusOneGoal = 1;
    }

    let goalDiff = minGd + homeGoalsGd + awayGoalsGd;
    return goalDiff;
  }
}

function calcOutcome(home: number, away: number): string {
  if(home > away){
    return 'w';
  }
  if(home < away){
    return 'l';
  }
  if(home === away){
    return 'd';
  }
}

export const goalDiffCalculator = new GoalDiffCalculator();