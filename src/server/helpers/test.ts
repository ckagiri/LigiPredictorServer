import {predicitonProcessor} from './prediction-processor';

let zero = predicitonProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 0, goalsAwayTeam: 1
  });

let one = predicitonProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 1, goalsAwayTeam: 2
  });

let two = predicitonProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
  }, {
    goalsHomeTeam: 1, goalsAwayTeam: 1
  });

let three = predicitonProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
  }, {
    goalsHomeTeam: 2, goalsAwayTeam: 2
  });

let four = predicitonProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let five = predicitonProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let five2 = predicitonProcessor.process({
  goalsHomeTeam: 0, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 1
});

let six = predicitonProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let seven = predicitonProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let seven2 = predicitonProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 3, goalsAwayTeam: 3
});

let seven3 = predicitonProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let eight = predicitonProcessor.process({
  goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 0
});

let eight2 = predicitonProcessor.process({
  goalsHomeTeam: 1, goalsAwayTeam: 1
}, {
  goalsHomeTeam: 1, goalsAwayTeam: 1
});

let nine = predicitonProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 0
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 0
});

let ten = predicitonProcessor.process({
  goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 2, goalsAwayTeam: 2
});

let ten2 = predicitonProcessor.process({
  goalsHomeTeam: 3, goalsAwayTeam: 2
}, {
  goalsHomeTeam: 3, goalsAwayTeam: 2
});
console.log(zero);