import {leaderboardRepo, userScoreRepo, fixtureRepo, predictionRepo} from '../common'
import {finishedFixturePublishHandler} from './finishedFixture-publish'
import * as Rx from 'rxjs'
import * as _ from 'lodash'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

let leaderboardObsCache = {};
let roundFixtures = {};

class FinishedFixtureDbUpdateHandler {
  handle(finishedFixtures: any[]) {
		let boardIds: any[] = [];
		console.log("Finished fixture db update handler");
		Rx.Observable.from(finishedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status)
			})
			.do((fixture: any) => {
				console.log("the game : " + getFixtureName(fixture) + " has been updated");
			})
			// update roundFixturesCache
			.flatMap((fixture: any) => {
				return finishedFixturePublishHandler.handle(fixture)
			})
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				return predictionRepo.update(prediction)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			// pick joker(fixtureIds)
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				// getCached
				let leaderboardKey = fixture.season;
				let leaderboardObs = leaderboardObsCache[leaderboardKey]
				if(leaderboardObs == null) {
					leaderboardObs = leaderboardRepo.findOneBySeasonAndUpdateStatus(fixture.season, "UpdatingScores")
					leaderboardObsCache[leaderboardKey] = leaderboardObs;
				}
				return leaderboardObs.map((leaderboard: any) => {
					let boardId = leaderboard._id.toString();
					if (boardIds.indexOf(boardId) === -1) {
						boardIds.push(boardId);
					}
					return {user, fixture, prediction, leaderboard}
				})
			})
			.concatMap((map: any) => {
				let{leaderboard, user, fixture, prediction} = map;
				let leaderboardId = leaderboard._id;
				let userId = user._id;
				let predictionId = prediction._id;
				let scorePoints = prediction.scorePoints.toObject();
				let {points, goalDiff} = prediction
				let predictionScore = {
					scorePoints, points, goalDiff
				}
				return userScoreRepo.createOrfindOneAndUpdate(
					leaderboardId, userId, predictionId, predictionScore)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			//.onErrorResumeNext()
			.subscribe(
				(map: any) => {
					let {user, fixture, prediction} = map;
					let choiceGoalsHomeTeam = 	prediction.choice.goalsHomeTeam;
					let choiceGoalsAwayTeam = prediction.choice.goalsAwayTeam;
					console.log(`${user.displayName}, ${getFixtureName(fixture)}, ${choiceGoalsHomeTeam} ${choiceGoalsAwayTeam}`)
				},
				(err: any) => {console.log(`Oops... ${err}`)},
				() => {
					// AllPredictionsProcessed
					Rx.Observable.from(boardIds)
						.flatMap((leaderboardIds: any[]) => {
							return Rx.Observable.from(boardIds);
						})
						.flatMap((leaderboardId: any) => { 
							return leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "UpdatingRankings")
						})	
						.do((leaderboard: any) => { 
							let leaderboardId = leaderboard._id;
							userScoreRepo.getByLeaderboardOrderByPoints(leaderboardId)						
								.flatMap((scores: any[]) => {
									return Rx.Observable.from(scores);
								})	
								.flatMap((score: any, index: number) => { 
									index += 1;
									let previousPosition = score.posNew || 0;
									let posOld = previousPosition;
									let posNew = index;
									return userScoreRepo.update(score._id, {posOld, posNew});
								})
								.subscribe(
									() => {},
									(err: any) => {},
									() => {
										leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "Refreshed")
									})
						})
						.subscribe(
							() => {},
							(err: any) => {},
							() => {
								console.log('rankings updated')
							})
					})
	}
}

export const finishedFixtureDbUpdateHandler = new FinishedFixtureDbUpdateHandler();
