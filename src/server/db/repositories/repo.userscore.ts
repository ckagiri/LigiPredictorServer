import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {UserScore, IUserScore} from '../models/user-score.model';

export class UserScoreRepo {
  createOrfindOneAndUpdate(leaderboardId: string, userId: string, predictionId: string, predictionScore: any) {
    let {points, goalDiff} = predictionScore,
    score: IUserScore = {
      leaderboard: leaderboardId,
      user: userId, 
      points: points,
      goalDiff: goalDiff,
      predictions: ['']
    }
    return Rx.Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {    
        UserScore.findOne({leaderboard: leaderboardId}, 
        (err, standing: any) => {
          if(standing == null) {
            score.predictions = [predictionId]
            UserScore.create(score, (err: any, result: any) => {
	            if (err) return reject(err);
              return resolve(result);
        	  });
          } else {
            let predExists = false;
            standing.predictions.forEach(function(predId: any){
              if(predId.toString() == predictionId) {
                predExists = true;
              }
            })
            if(predExists) {
              return resolve(standing)
            }
            standing.points += score.points;
            standing.goalDiff += score.goalDiff;
            UserScore.findByIdAndUpdate(
              {_id: standing._id}, 
              {
                $set: {points: standing.points, goalDiff: standing.goalDiff},
                $push: {predictions: predictionId}
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
    return UserScore.find({leaderboard: leaderboardId}, null, {sort: {points: -1, goalDiff: -1}});
  }

  update(score: any) {
    let {_id} = score;  
    return Rx.Observable.fromPromise(UserScore.findByIdAndUpdate({_id}, {$set: score}));
  }
}