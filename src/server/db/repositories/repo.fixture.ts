import {AbstractRepo} from './repo.abstract';
import {Fixture} from '../models/fixture.model';
import * as Rx from 'rxjs';

export class FixtureRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Fixture, converter);
  }  

	findAllBySeason(seasonId: string) {
		return this.findAll({season: seasonId})
	}

	findAllBySeasonRound(seasonId: string, round: number) {
		let query = {$and: [{season: seasonId}, {round}]}
		return this.findAll(query, null, {sort: 'date'})
	}

	findAvailableBySeasonRound(seasonId: string, round: number) {
		let query = {$or: [
          {$and: [
						{season: seasonId}, {round}, 
						{status: {$in: ['SCHEDULED', 'TIMED', 'IN_PLAY']}}
					]},
          {$and: [
						{season: seasonId}, {round}, 
						{status: {$in: ['CANCELED', 'POSTPONED', 'FINISHED']}},
						{allPredictionsProcessed: false}
					]}
				]}

		return this.findAll(query, null, {sort: 'date'})
	}

	getByApiIds(apiIds: string[]) {
		let apiDetailIdKey = this.apiDetailIdKey();
		let query = {[apiDetailIdKey] : {$in : apiIds}};
		return this.findAll(query);
	}

	findById(fixtureId: any) {
		return this.findOne({_id: fixtureId});
	}

	updateFixtureById(fixtureId: any, result: any, status: any, odds?: any) {
		let update: any = {
			result: result,
			status: status,
			odds: odds
		}
		Object.keys(update).forEach((key) => (update[key] == null) && delete update[key])
		return this.updateById({_id: fixtureId}, {$set: update});
	}

	private findFixtureAndUpdate(query: any, update: any) {
		let options = { upsert: true, new: true };
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Fixture.findOneAndUpdate(query, update, 
					{new: true, upsert: true}, 
					(err:any, result:any) => {
						if(err){
							return reject(err);
						}
						resolve(result);
					})
			}))
	}
	
	allPredictionsProcessed(fixtureId:any) {
    return this.findFixtureAndUpdate({_id: fixtureId}, {allPredictionsProcessed: true});
  }
}