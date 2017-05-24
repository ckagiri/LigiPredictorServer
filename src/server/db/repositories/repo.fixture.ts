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
		let query = {$and: [{'season': seasonId}, {round}]}
		return this.findAll(query)
	}

	getByApiIds(apiIds: string[]) {
		return this.findAll({"api_detail.id": {$in: apiIds}});
	}

	updateFixture(fixtureId: string, result: any, status: any, odds: any) {
		return this.update({_id: fixtureId}, {$set: {
			result: result,
			status: status,
			odds: odds
		}});
	}
}