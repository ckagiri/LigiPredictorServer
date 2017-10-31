import {AbstractRepo} from './repo.abstract';
import {Fixture} from '../models/fixture.model';
import * as Rx from 'rxjs';

export class FixtureRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Fixture, converter);
  }  

	findAllBySeason(seasonId: string) {
		return this.findAll({'season': seasonId})
	}

	findAllBySeasonRound(seasonId: string, round: number) {
		let query: any = {$and: [{'season': seasonId}, {round}]}
		return this.findAll(query, null, {sort: 'date'})
	}

	findAllScheduledBySeasonRound(seasonId: string, round: number) {
		let query: any = {$and: [{'season': seasonId}, {round}]}
		if(status != null) {
			query = {$and: [{'season': seasonId}, {round}, {status: {$in: ['SCHEDULED', 'TIMED']}}]}
		}
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

	updateFixture(fixtureId: any, result: any, status: any, odds: any) {
		let update: any = {
			result: result,
			status: status,
			odds: odds
		}
		Object.keys(update).forEach(key => update[key] == null && delete update[key])
		return this.update({_id: fixtureId}, {$set: update});
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
}