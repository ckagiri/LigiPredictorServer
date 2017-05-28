import {goalDiffCalculator} from './goaldiff-calculator'
import {pointsCalculator} from './points-calculator'
import {IMatchScore, IScorePoints, IPredictionScore} from './contracts'

class PredictionProcessor {
  process(choice: IMatchScore, result: IMatchScore): IPredictionScore {
    let goalDiff = goalDiffCalculator.process(choice, result);
    let scorePoints = pointsCalculator.process(choice, result);
    let points = Object.keys(scorePoints)
      .reduce(function(sum, key) {
        return sum + scorePoints[key];
      }, 0);
    return {scorePoints, points, goalDiff};
  }
}

export const predictionProcessor = new PredictionProcessor();