import {AbstractRepo} from './repo.abstract';
import {Prediction} from '../models/prediction.model';
import * as Rx from 'rxjs';

export class PredictionRepo {

	findOneOrCreateDefault(userId: string, fixtureId: string) {
		let query = {userId, fixtureId},
    		update = {userId, fixtureId},
    		options = { upsert: true, new: true, setDefaultsOnInsert: true };
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Prediction.findOneAndUpdate(query, update, options)
					.lean()
					.exec(function(err: any, prediction: any) {
						if (err) reject(err);
						if (!prediction) 
							reject(new Error(`Failed to load Prediction - user: ${userId} fixture: ${fixtureId}`))
						return resolve(prediction);
					})
			}))
	}

	findOneOrCreate = (userId: string, fixture: any) => {
		let fixtureId = fixture._id;
		let query = {userId, fixtureId},
    		update = {userId, fixtureId, choice: {}},
    		options = { upsert: true, new: true, setDefaultsOnInsert: true };
		let matchScores = this.getMatchScores(fixture);
		update.choice = matchScores;
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Prediction.findOneAndUpdate(query, update, options)
					.lean()
					.exec(function(err: any, prediction: any) {
						if (err) reject(err);
						if (!prediction) 
							reject(new Error(`Failed to load Prediction - user: ${userId} fixture: ${fixtureId}`))
						return resolve(prediction);
					})
			}))
	}

  update(prediction: any, options: any = {overwrite: false}){
    let {_id} = prediction;
    return Rx.Observable.fromPromise(Prediction.update({_id}, prediction, options));
  }

  create(predictions: any[]) {
    return Rx.Observable.fromPromise(	new Promise((resolve: any, reject: any) => {    
      Prediction.create(predictions, function(err: any, savedPredictions: any) {
        if (err) reject(err);
        return resolve(savedPredictions);
      })
    }));
  }

	private getMatchScores(fixture: any) {
		return {
			goalsHomeTeam: 1,
			goalsAwayTeam: 2
		}
	}
}