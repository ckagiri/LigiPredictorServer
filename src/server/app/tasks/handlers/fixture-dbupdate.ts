import {fixtureRepo, predictionRepo, toObjectId} from '../common'
import {predictionHandler} from './fixture-publish'
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
			.do((fixture: any) => {
				console.log("the game : " + getFixtureName(fixture) + " has been updated");
			})
			.flatMap((fixture: any) => {
				return predictionHandler.handle(fixture)
					.flatMap((map: any) => {
						let {user, fixture, prediction} = map;
						return predictionRepo.update(prediction)
							.do(() => {
								// if(!boards[fixture.season]) {
								//   return boardInfoRepo.updateStatus('compute-started')
								//     .onErrorResumeNext(Rx.Observable.empty())
								// }
								return Rx.Observable.empty()
							})
							.flatMap((status: any) => {
								let userId = user._id;
								let seasonId = fixture.season;
								let predictionId = prediction._id;
								let scorePoints = prediction.scorePoints.toObject();
								let {points, goalDiff} = prediction
								let predictionScore = {
									scorePoints, points, goalDiff
								}
								//return leaderboardRepo.findOneAndUpdateScore(userId, seasonId, predictionId, predictionScore)
								return Rx.Observable.of({user, fixture, prediction})
							})
					})
			})
			.onErrorResumeNext()
			.subscribe(
				(map: any) => {
					console.log("user-fixture-prediction has been processed");
				},
				(err: any) => {console.log(`Oops... ${err}`)},
				() => {console.log("To process rankings...");})
			}
}
export const fixtureDbUpdateHandler = new FixtureDbUpdateHandler();
