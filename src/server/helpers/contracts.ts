export interface IMatchScore {
  goalsHomeTeam: number;
  goalsAwayTeam: number;
}

export interface IScorePoints {
  matchOutcome: number;
  goalDifference: number;
  teamScore: number; 
  matchScore: number; 
  teamScoreOfTwoOrMore: number;
  plusOrMinusOneGoal: number;
}

export interface IPredictionScore {
  scorePoints: IScorePoints;
  points: number;
  goalDiff: number
}