import {AbstractRepo} from './repo.abstract';
import {FixtureRepo} from './repo.fixture';
import {Prediction, IPredictionModel, IPrediction, IPrectionChoice} from '../models/prediction.model';
import {VosePredictor} from '../../helpers/vose-predictor';
import {Fixture} from '../models/fixture.model';
import * as Rx from 'rxjs';

export interface JokerPick {
	user: string;
	season: string;
	round: number;
	pick: string | [string]
}

export class PredictionRepo {
	findAll() {
		return Rx.Observable.fromPromise(Prediction.find({}).lean());
	}

	findOne(user: string, fixture: string){
    return Rx.Observable.fromPromise(Prediction.findOne({user, fixture}).lean());
  }

	findAllBySeasonRound(userId: string, seasonId: string, round: number) {
		let query = {$and: [{user: userId}, {season: seasonId}, {round}]}
		return Rx.Observable.fromPromise(Prediction.find(query).lean());
	}

	findOneOrCreate = (user: string, fixture: any) => {
		let query = {user, fixture: fixture._id};
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Prediction.findOne(query, (err, result) => {
					if (err) return reject(err);
					if (result) return resolve(result);
					let {_id: fixtureId, slug: fixtureSlug, season, round, odds} = fixture;
					let	pred = {user, fixture: fixtureId, fixtureSlug, season, round, choice: {}};
					let matchScores = this.getMatchScores(odds);
					pred.choice = matchScores;
					Prediction.create(pred, (err: any, result: any) => {
	          if (err) return reject(err);
						return resolve(result);
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

	pickJoker = (opts: JokerPick)  => { 
		let {user, season, round, pick} = opts;
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				let query = {
					user, season, round, hasJoker: true
				}
				Prediction.findOne(query, (err, currentJoker) => {
					let newJokerFixtureId: string;
					if(pick instanceof Array) {
						if(currentJoker) {
							return resolve(currentJoker)
						} else {
							newJokerFixtureId = pick[Math.floor(Math.random() * pick.length)];	
							this.pickJokerFixture(user, currentJoker, newJokerFixtureId, true, resolve, reject)	
						}
					} else {
						newJokerFixtureId = pick;
						if(currentJoker && currentJoker.status.toString() === 'PROCESSED') {
							return reject(new Error('Joker prediction already processed'))
						}
						this.pickJokerFixture(user, currentJoker, newJokerFixtureId, false, resolve, reject)	
					}
				})	
			}))
	}
		
	private pickJokerFixture = (user: string, currentJoker: IPrediction, newJokerFixtureId: string, autoPicked: boolean, resolve: any, reject: any) => {
		Fixture.findById(newJokerFixtureId, (err, newJokerFixture) => {
			if(!newJokerFixture) return reject(new Error('Bad'));
			let {slug: fixtureSlug, season, round, odds} = newJokerFixture;
			if(autoPicked || newJokerFixture.status === 'SCHEDULED' || newJokerFixture.status === 'TIMED') {
				Prediction.findOne({user, fixture: newJokerFixtureId}, (err, newJokerPrediction) => {
					if (err) return reject(err);
					let newJoker: IPrediction;
					if(!newJokerPrediction) {
						let matchScores = this.getMatchScores(odds);
						newJoker = {
							user, fixture: newJokerFixtureId, fixtureSlug, season, round,
							hasJoker: true, jokerAutoPicked: autoPicked, choice: matchScores
						}
					} else {
						newJoker = newJokerPrediction;
						newJoker.hasJoker = true;
						newJoker.jokerAutoPicked = autoPicked;
					}
					let predictionJokers: [IPrediction] = [newJoker];
					if(currentJoker) {
						currentJoker.hasJoker = false;
						predictionJokers.unshift(currentJoker)
					}
					Prediction.create(predictionJokers, (err, savedPredictions) => {
        		if (err) return reject(err);
						if (!savedPredictions) {
							return reject(new Error(`Failed to saved predictions`))
						}
						let currentNewJoker = savedPredictions.filter(n => {
							return n.fixture.toString() === newJoker.fixture.toString();
						})[0];
						return resolve(currentNewJoker);
					})
				})
			} else {
				return reject(new Error('Fixture not scheduled'))
			}
		})
	}

	update(prediction: any, options: any = {overwrite: false}){
    let {_id} = prediction;
    return Rx.Observable.fromPromise(Prediction.update({_id}, prediction, options));
  }

  updateById(conditions: any, doc: any, options: any = {overwrite: false, new: true}){
    return Rx.Observable.fromPromise(Prediction.findByIdAndUpdate(conditions, doc, options));
  }

	private getMatchScores(odds: any) {
		let predictor = new VosePredictor(odds);
		let score = predictor.predict();
		let goals = score.split('-');
		let goalsHomeTeam = Number(goals[0]);
		let goalsAwayTeam = Number(goals[1]);
		return {
			goalsHomeTeam, goalsAwayTeam,
			isComputerGenerated: true
		}
	}
}