import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {Leaderboard, ILeaderboard} from '../models/leaderboard.model';

export class LeaderboardRepo {
  createOrfindOneAndUpdate(userId: string, seasonId: string, round: number, predictionId: string, predictionScore: any) {
    let {points, goalDiff} = predictionScore;
    let query: any = {$and: [{user: userId}, {season: seasonId}]},
    score: IScore = {
      user: userId, 
      season: seasonId,
      round: round,
      points: points,
      goalDiff: goalDiff
    }
    return Rx.Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {    
        Leaderboard.findOne({$and: [{user: userId}, {season: seasonId}]}, 
        (err, standing: any) => {
          if(standing == null) {
            score.predictions = [predictionId]
            Leaderboard.create(score, (err: any, result: any) => {
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
            Leaderboard.findByIdAndUpdate(
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
}

interface IScore {
  user: string;
  season: string;
  round?: number
  points?: number;
  goalDiff?: number;
  predictions?: any[]
}