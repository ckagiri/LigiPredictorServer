import {fixtureRepo} from '../common'
import * as Rx from 'rxjs'

class ApiFixtureDbUpdateHandler {
  handle(unfinishedFixtures: any[]) {
		console.log("api-fixture db update handler");
		return Rx.Observable.from(unfinishedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status)
			})
	}
}

export const apiFixtureDbUpdateHandler = new ApiFixtureDbUpdateHandler();
