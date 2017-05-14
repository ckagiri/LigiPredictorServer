import {AbstractRepo} from './repo.abstract';
import {Fixture} from '../models/fixture.model';
import * as Rx from 'rxjs';

export class FixtureRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Fixture, converter);
  }  

	findAllBySeason(seasonId: string) {
		return this.findAll({'season':seasonId})
	}

	findAllBySeasonRound(season: string, round: number) {
			let query = {$and: [{season}, {round}]}
			return this.findAll(query)
	}
}