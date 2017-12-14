import {leaderboardRepo, userScoreRepo, fixtureRepo, predictionRepo} from '../common'
import {finishedFixturePublishHandler} from './finishedFixture-publish'
import * as Rx from 'rxjs'
import * as _ from 'lodash'

let getFixtureName = (fixture: any) => {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FinishedFixtureDbUpdateHandler {
  handle(finishedFixtures: any[], fromDb?: boolean) {
		let leaderboardObsCache = {};
		let roundFixturesObsCache = {};
		let boardIds: any[] = [];
		console.log("Finished fixture db update handler");
		Rx.Observable.from(finishedFixtures)
			.flatMap((fixture: any) => {
				if (fixture.status === 'FINISHED' && fixture.allPredictionsProcessed === false) {
					return Rx.Observable.of(fixture);
				}
				return fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status)
			})
			.do((fixture: any) => {
				if(!fromDb) {
					console.log("the game : " + getFixtureName(fixture) + " has been updated");
				}
			})
			.flatMap((fixture: any) => {
				let {season, round} = fixture;
				let roundFixturesKey = `${season}-${round}`;
				let roundFixturesObs = roundFixturesObsCache[roundFixturesKey];
				if(roundFixturesObs == null) {
					roundFixturesObs = fixtureRepo.findAvailableBySeasonRound(season, round)
					roundFixturesObsCache[roundFixturesKey] = roundFixturesObs;
				}
				return roundFixturesObs.map((fixtures: any[]) => {
					let roundFixtureIds = _.map(fixtures, val => val._id.toString());
					roundFixtureIds.push(fixture._id.toString())
					return {fixture, roundFixtureIds};
				})
			})
			.concatMap((map: any) => {
				let {fixture, roundFixtureIds} = map;
				return finishedFixturePublishHandler.handle(fixture, roundFixtureIds)
			})
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;	
        if(prediction.status === 'ALREADY_PROCESSED') {
          return Rx.Observable.of({user, fixture, prediction});
        }
				return predictionRepo.update(prediction)
					.map((_: any) => {
						return {user, fixture, prediction}
					})
			})
			.flatMap((map: any) => {
				let {user, fixture, prediction} = map;
				let {season, round} = fixture;
				let month = fixture.date.getUTCMonth() + 1;
				let year = fixture.date.getFullYear();
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
				let monthBoardKey = `${season}-${year}-${month}`;
				let monthBoardObs = leaderboardObsCache[monthBoardKey]
				if(monthBoardObs == null) {
					monthBoardObs = leaderboardRepo.findOneByMonthAndUpdate({season, round, year, month, status: "UpdatingScores"})
					leaderboardObsCache[monthBoardKey] = monthBoardObs;
				}
				return Rx.Observable.forkJoin(seasonBoardObs, roundBoardObs, monthBoardObs)
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
				let fixtureId = fixture._id;
				let predictionId = prediction._id;
				let scorePoints = prediction.scorePoints.toObject();
				let {points, goalDiff, hasJoker} = prediction
				let predictionScore = {
					scorePoints, points, goalDiff
				}
				return userScoreRepo.findOneAndUpdateOrCreate(
					leaderboardId, userId, fixtureId, predictionId, predictionScore, hasJoker)
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
					//console.log(`${user.displayName}, ${getFixtureName(fixture)}, ${choiceGoalsHomeTeam} ${choiceGoalsAwayTeam}`)
				},
				(err: any) => {console.log(`Oops... ${err}`)},
				() => {		
					Rx.Observable.from(boardIds)
						.flatMap((leaderboardId: any) => { 
							return leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "UpdatingRankings")
						})	
						.flatMap((leaderboard: any) => { 
							let leaderboardId = leaderboard._id;
							return userScoreRepo.getByLeaderboardOrderByPoints(leaderboardId)
                .flatMap((scores: any[]) => {
                  return Rx.Observable.from(scores)
                })	
                .flatMap((score: any, index: number) => { 
                  index += 1;
                  let previousPosition = score.posNew || 0;
                  let posOld = previousPosition;
                  let posNew = index;
                  return userScoreRepo.update(score._id, {posOld, posNew})
                    .map((_: any) => {
                      return leaderboardId.toString()
                    })
                })
            })
            .distinct()
            .toArray()
            .flatMap((leaderboardIds: any[]) => {
              return Rx.Observable.from(leaderboardIds)
            })
						.subscribe(
							(leaderboardId) => {
                leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "Refreshed");
              },
							(err: any) => {},
							() => {
                console.log('rankings updated')
                Rx.Observable.from(finishedFixtures)
                  .flatMap((fixture: any) => { 
                    return fixtureRepo.allPredictionsProcessed(fixture._id)
                  }).subscribe(
                    (fixture: any) => {
                      console.log(`${fixture.slug} all predictions processed`)
                    },
                    (err: any) => {},
                    () => {
                      console.log('all fixture predictions processed')
                    })			
							})
					})
	}
}

export const finishedFixtureDbUpdateHandler = new FinishedFixtureDbUpdateHandler();
