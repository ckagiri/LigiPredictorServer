import {fixtureRepo} from '../common'
import * as Rx from 'rxjs'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class UnfinishedFixtureDbUpdateHandler {
  handle(unfinishedFixtures: any[]) {
		console.log("Unfinished fixture db update handler");
		Rx.Observable.from(unfinishedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status)
			})
			.subscribe((fixture: any) => {
          console.log("the game : " + getFixtureName(fixture) + " has been updated");
				},
				(err: any) => {console.log(`Oops... ${err}`)},
				() => {	
        })
	}
}

export const unfinishedFixtureDbUpdateHandler = new UnfinishedFixtureDbUpdateHandler();
