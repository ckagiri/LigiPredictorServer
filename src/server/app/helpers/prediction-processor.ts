import {goalDiffCalculator} from './goaldiff-calculator'
import {IMatchScore} from './IMatchScore'

class PredictionProcessor {
  process(choice: IMatchScore, result: IMatchScore) {
    let goalDiff = goalDiffCalculator.process(choice, result);
    return goalDiff;
  }
}

export const predicitonProcessor = new PredictionProcessor();