import {IMatchScore} from './contracts'
class GoalDiffCalculator {
  process(choice: IMatchScore, result: IMatchScore): number {
    let choiceGd = Math.abs(choice.goalsHomeTeam - choice.goalsAwayTeam);
    let resultGd = Math.abs(result.goalsHomeTeam - result.goalsAwayTeam);
    let homeGoalsGd = null;
    let awayGoalsGd = null;
    let bonusEqualGd = 0;
    let minGd = Math.min(choiceGd, resultGd);
    if (minGd === 0) {
      minGd = 1;
    }

    let choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
    let resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
    if(choiceOutcome === resultOutcome) {
      homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
      awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
      if(homeGoalsGd > 0 && awayGoalsGd > 0 &&  choiceGd === resultGd) {
        bonusEqualGd = 1;
      }    
      if(homeGoalsGd === 1) {
        homeGoalsGd = 0;
      } else {
        homeGoalsGd = null;
      }

      if(awayGoalsGd === 1) {
        awayGoalsGd = 0;
      } else {
        awayGoalsGd = null;
      }
    }

    if(homeGoalsGd === null) {
      homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
      if(homeGoalsGd === 0) {
        homeGoalsGd = result.goalsHomeTeam || 1;
      } else {
        homeGoalsGd = -homeGoalsGd;
      }
    }

    if(awayGoalsGd === null) {
      awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
      if(awayGoalsGd === 0) {
        awayGoalsGd = result.goalsAwayTeam || 1;
      } else {
        awayGoalsGd = -awayGoalsGd;
      }
    }

    let goalDiff = minGd + homeGoalsGd + awayGoalsGd + bonusEqualGd;
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