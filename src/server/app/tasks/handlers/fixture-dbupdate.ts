import {boardInfoRepo, leaderboardRepo, fixtureRepo, predictionRepo, toObjectId} from '../common'
import {predictionHandler} from './fixture-publish'
import * as Rx from 'rxjs'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FixtureDbUpdateHandler {
  handle(changedFixtures: any[]) {
		let boards: any = {};
		console.log("fixture db update handler");
		Rx.Observable.from(changedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status, fixture.odds)
			})
			.do((fixture: any) => {
				console.log("the game : " + getFixtureName(fixture) + " has been updated");
			})
			.flatMap((fixture: any) => {
				return predictionHandler.handle(fixture)
			})
			.onErrorResumeNext()
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				return predictionRepo.update(prediction)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			.do((map) => {
				let seasonId = map.fixture.season.toString();
				if(!boards[seasonId]) {
					boards[seasonId] = 1;													 
				  boardInfoRepo.updateStatus(seasonId, 'compute-started')
						.subscribe(() => {});
				}
			})
			.flatMap((map: any) => {
				let{user, fixture, prediction} = map;
				let userId = user._id;
				let seasonId = fixture.season;
				let round = fixture.round;
				let predictionId = prediction._id;
				let scorePoints = prediction.scorePoints.toObject();
				let {points, goalDiff} = prediction
				let predictionScore = {
					scorePoints, points, goalDiff
				}
				return leaderboardRepo.createOrfindOneAndUpdate(
					userId, seasonId, round, predictionId, predictionScore)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			.onErrorResumeNext()
			.subscribe(
				(map: any) => {
					console.log("user-fixture-prediction has been upserted");
				},
				(err: any) => {console.log(`Oops... ${err}`)},
				() => {
					console.log("To process rankings...");
				})
	}
}

export const fixtureDbUpdateHandler = new FixtureDbUpdateHandler();
