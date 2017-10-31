import {leaderboardRepo, userScoreRepo, fixtureRepo, predictionRepo} from '../common'
import {finishedFixturePublishHandler} from './finishedFixture-publish'
import * as Rx from 'rxjs'
import * as _ from 'lodash'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FinishedFixtureDbUpdateHandler {
  handle(finishedFixtures: any[]) {
		let leaderboardObsCache = {};
		let roundFixturesObsCache = {};
		let boardIds: any[] = [];
		console.log("Finished fixture db update handler");
		Rx.Observable.from(finishedFixtures)
			.flatMap((fixture: any) => {
				return Rx.Observable.of(fixture);
			})
			.flatMap((fixture: any) => {
				let {season, round} = fixture;
				let roundFixturesKey = `${season}-${round}`;
				let roundFixturesObs = roundFixturesObsCache[roundFixturesKey];
				if(roundFixturesObs == null) {
					roundFixturesObs = fixtureRepo.findAllScheduledBySeasonRound(season, round)
					roundFixturesObsCache[roundFixturesKey] = roundFixturesObs;
				}
				return roundFixturesObs.map((fixtures: any[]) => {
					let roundFixtureIds = _.map(fixtures, val => val._id.toString());
					return {fixture, roundFixtureIds};
				})
			})
			.flatMap((map: any) => {
				let {fixture, roundFixtureIds} = map;
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status)
					.map((_:any) => {
						return {
							fixture, roundFixtureIds
						}
					});
			})
			.do((map: any) => {
				console.log("the game : " + getFixtureName(map.fixture) + " has been updated");
			})
			.flatMap((map: any) => {
				let {fixture, roundFixtureIds} = map;
				return finishedFixturePublishHandler.handle(fixture, roundFixtureIds)
			})
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				return predictionRepo.update(prediction)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				let {season, round} = fixture;
				let seasonBoardKey = season;
				let seasonBoardObs = leaderboardObsCache[seasonBoardKey]
				if(seasonBoardObs == null) {
					seasonBoardObs = leaderboardRepo.findOneBySeasonAndUpdate({season, status: "UpdatingScores"})
					leaderboardObsCache[seasonBoardKey] = seasonBoardObs;
				}
				let roundBoardKey = `${season}-${round}`;
				let roundBoardObs = leaderboardObsCache[roundBoardKey]
				if(roundBoardObs == null) {
					roundBoardObs = leaderboardRepo.findOneByRoundAndUpdate({season, round, status: "UpdatingScores"})
					leaderboardObsCache[roundBoardKey] = roundBoardObs;
				}
				return Rx.Observable.forkJoin(seasonBoardObs, roundBoardObs)
					.flatMap((leaderboards: any[]) => {
						return Rx.Observable.from(leaderboards);
					})
					.map((leaderboard: any) => {
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
				let {points, goalDiff, hasJoker} = prediction
				let predictionScore = {
					scorePoints, points, goalDiff
				}
				return userScoreRepo.findOneAndUpdateOrCreate(
					leaderboardId, userId, predictionId, predictionScore, hasJoker)
					.map((status: any) => {
						return {user, fixture, prediction}
					})
			})
			// handle errors??
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
