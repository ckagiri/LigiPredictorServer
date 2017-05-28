import {fixtureRepo} from '../common'
import {fixturePublishHandler} from './fixture-publish'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FixtureDbUpdateHandler {
  handle(changedFixtures: any[]) {
		console.log("fixture db update handler");

		for (let fixture of changedFixtures) {
			fixtureRepo.updateFixture(fixture._id, fixture.result, fixture.status, fixture.odds)
				.subscribe ((status: any) => {
					console.log(status);
					console.log("the game : " + getFixtureName(fixture) + " has updated");
          fixturePublishHandler.handle(fixture);
				});
		}
  }
}
export const fixtureDbUpdateHandler = new FixtureDbUpdateHandler();