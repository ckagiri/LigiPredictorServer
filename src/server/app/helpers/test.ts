import {predicitonProcessor} from './prediction-processor';

let xs = predicitonProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 1
  }, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
  });

console.log(xs);