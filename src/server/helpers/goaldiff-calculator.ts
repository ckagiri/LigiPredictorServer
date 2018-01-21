import {IMatchScore} from './contracts'
class GoalDiffCalculator {
  process(choice: IMatchScore, result: IMatchScore): number {
    let defaultGd = 2;
    let homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
    let awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
      
    if(homeGoalsGd === 0) {
      homeGoalsGd = result.goalsHomeTeam || 1;
    } else {
      homeGoalsGd = -homeGoalsGd;
    }
    
    if(awayGoalsGd === 0) {
      awayGoalsGd = result.goalsAwayTeam || 1;
    } else {
      awayGoalsGd = -awayGoalsGd;
    }

    let goalDiff = defaultGd + homeGoalsGd + awayGoalsGd;
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