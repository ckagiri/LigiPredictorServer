import {AbstractRepo} from './repo.abstract';
import {Prediction} from '../models/prediction.model';
import * as Rx from 'rxjs';

export class PredictionRepo {
	findOne(user: string, fixture: string){
    return Rx.Observable.fromPromise(Prediction.findOne({user, fixture}).lean());
  }

	findOneOrCreate = (user: string, fixture: any) => {
		let {_id :fixtureId, slug :fixtureSlug, season, round, odds} = fixture;
		let query = {user, fixture: fixtureId},
    		pred = {user, fixture: fixtureId, fixtureSlug, season, round, choice: {}};
		let matchScores = this.getMatchScores(odds);
		pred.choice = matchScores;
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Prediction.findOne(query, (err, result) => {
					if (err) return reject(err);
					if (result) return resolve(result);
					Prediction.create(pred, (err: any, result: any) => {
	          if (err) return reject(err);
						resolve(result);
        	});
				})
			}))
	}

	findOneAndUpdateOrCreate = (user: string, fixture: any, choice: any) => {
		let {_id :fixtureId, slug :fixtureSlug, season, round, odds} = fixture;
		let query = {user, fixture: fixtureId},
    		pred = {user, fixture: fixtureId, fixtureSlug, season, round, choice},
    		options = { upsert: true, new: true, setDefaultsOnInsert: true };
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Prediction.findOneAndUpdate(query, pred, options)
					.lean()
					.exec(function(err: any, prediction: any) {
						if (err) reject(err);
						if (!prediction) 
							reject(new Error(`Failed to load Prediction - user: ${user} fixture: ${fixture}`))
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

	insert(prediction: any){
		return Rx.Observable.fromPromise(Prediction.create(prediction));
  }

	private getMatchScores(fixture: any) {
		return {
			goalsHomeTeam: Math.floor(Math.random() * 3),
			goalsAwayTeam: Math.floor(Math.random() * 3),
			isComputerGenerated: true
		}
	}
}