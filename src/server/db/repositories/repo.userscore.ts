import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {UserScore, IUserScore} from '../models/user-score.model';

export class UserScoreRepo {
  findOneAndUpdateOrCreate(leaderboardId: string, userId: string, fixtureId: string, 
    predictionId: string, predictionScore: any, hasJoker: boolean) {
    let {points, goalDiff, scorePoints} = predictionScore,
    score: IUserScore = {
      leaderboard: leaderboardId,
      user: userId, 
      points: points,
      goalDiff: goalDiff,
      goalDiffPoints: scorePoints.goalDifference,
      fixtures: [''],
      predictions: ['']
    }
    return Rx.Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {    
        UserScore.findOne({leaderboard: leaderboardId, user: userId}, 
        (err, standing: any) => {
          if(standing == null) {
            score.fixtures = [fixtureId];
            score.predictions = [predictionId];
            score.pointsExcJoker = points;
            score.goalDiffExcJoker = goalDiff;
            if(hasJoker && score.goalDiff >= 0) {
              score.points += score.points;
              score.goalDiff += score.goalDiff;
              score.goalDiffPoints += score.goalDiffPoints;
            }
            UserScore.create(score, (err: any, result: any) => {
	            if (err) return reject(err);
              return resolve(result);
        	  });
          } else {
            let fixtureExists = false;
            let fixtures = standing.fixtures;
            for (let i = 0, len = fixtures.length; i < len; i++) {
              let fixture = fixtures[i];
              if(fixture.toString() == fixtureId) {
                fixtureExists = true;
              }
            }
            if(fixtureExists) {
              return resolve(standing)
            }
            standing.points += score.points;
            standing.pointsExcJoker += score.points
            standing.goalDiff += score.goalDiff;
            standing.goalDiffExcJoker += score.goalDiff;
            standing.goalDiffPoints += score.goalDiffPoints;
            if(hasJoker && score.goalDiff >= 0) {
              standing.points += score.points;
              standing.goalDiff += score.goalDiff;
              standing.goalDiffPoints += score.goalDiffPoints;
            }
            UserScore.findByIdAndUpdate(
              {_id: standing._id}, 
              {
                $set: {
                  points: standing.points, 
                  goalDiff: standing.goalDiff, 
                  goalDiffPoints: standing.goalDiffPoints,
                  pointsExcJoker: standing.pointsExcJoker,
                  goalDiffExcJoker: standing.goalDiffExcJoker
                },
                $push: {fixtures: fixtureId, predictions: predictionId}
              },
              (err: any, result: any) => {
                if (err) return reject(err);
                return resolve(result);
              })
          }
        })
      }))
  }
  
  getByLeaderboardOrderByPoints(leaderboardId: string) {
    return Rx.Observable.fromPromise(
      UserScore.find({
        leaderboard: leaderboardId}, 
        null, 
        {sort: {points: -1, goalDiff: -1, goalDiffPoints: -1}}
      ));
  }

  getOneByLeaderboardOrderByPoints(leaderboardId: string) {
    return Rx.Observable.fromPromise(
      UserScore.find({
        leaderboard: leaderboardId}, 
        null, 
        {sort: {points: -1, goalDiff: -1, goalDiffPoints: -1}}
      ).populate('user').lean());
  }

  update(scoreId: string, positions: any) {
    return Rx.Observable.fromPromise(UserScore.findByIdAndUpdate({_id: scoreId}, {$set: positions}));
  }
}