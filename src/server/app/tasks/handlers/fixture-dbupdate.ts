import {fixtureRepo, toObjectId} from '../common'
import {fixturePublishHandler} from './fixture-publish'
import * as Rx from 'rxjs'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FixtureDbUpdateHandler {
  handle(changedFixtures: any[]) {
		console.log("fixture db update handler");
		Rx.Observable.from(changedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status, fixture.odds)
			})
			.subscribe((fixture: any) => {
				console.log("the game : " + getFixtureName(fixture) + " has been updated");
			}, (err) => {
				console.log(err);
			}, () => {
				console.log("done");
			}
			);
  }
}
export const fixtureDbUpdateHandler = new FixtureDbUpdateHandler();