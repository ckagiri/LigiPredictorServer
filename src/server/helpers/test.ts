import {predictionProcessor} from './prediction-processor';

let zero = predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 0, goalsAwayTeam: 1
  });

let one = predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 1, goalsAwayTeam: 2
  });

let two = predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 1, goalsAwayTeam: 1
  });

let three = predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
  }, {
    goalsHomeTeam: 2, goalsAwayTeam: 2
  });

let four = predictionProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let five = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let five2 = predictionProcessor.process({
  goalsHomeTeam: 0, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 1
});

let six = predictionProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let seven = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let seven2 = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 3, goalsAwayTeam: 3
});

let seven3 = predictionProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let eight = predictionProcessor.process({
  goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let eight2 = predictionProcessor.process({
  goalsHomeTeam: 1, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 1
});

let nine = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let ten = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 2
});

let ten2 = predictionProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 3, goalsAwayTeam: 2
});

let a = predictionProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});
let a2 = predictionProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});
console.log("chalo");