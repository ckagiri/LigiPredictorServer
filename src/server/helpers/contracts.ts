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

export interface IPredictionPoints {
  scorePoints: IScorePoints;
  points: number;
  goalDiff: number
}