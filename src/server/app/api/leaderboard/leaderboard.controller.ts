import {Request, Response} from 'express';
import * as _ from 'lodash';
import {Leaderboard, ILeaderboard, ILeaderboardModel} from '../../../db/models/leaderboard.model';
import {LeagueRepo, SeasonRepo, LeaderboardRepo, UserScoreRepo, TeamRepo, FixtureRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../../db/converters/ligi-predictor';
import isMongoId from '../../utils/isMongoId'

import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
let leaderboardRepo = new LeaderboardRepo();
let userScoreRepo = new UserScoreRepo();
let teamRepo = new TeamRepo(new TeamConverter())
let fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, TeamRepo))

export class LeaderboardController {
	show(req: Request, res: Response) {
		let {id} = req.params;
		let source: Rx.Observable<any> = null;
		if(isMongoId(id)) {
			source = leaderboardRepo.findOne({_id: id})
		}
		if (source == null) {
			res.status(500).json("bad request");	
		}

		source.subscribe((leaderboard: any) => {
					res.status(200).json(leaderboard);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

  seasonList(req: Request, res: Response) {
    let {league: leagueSlug, season: seasonSlug}= req.params;
    let source: Rx.Observable<any>;
    if(leagueSlug == null && seasonSlug == null) {
      source = seasonRepo.getDefault();
    } else {
      source = singleSeason(leagueSlug, seasonSlug)
    }
    source
      .flatMap((season: any) => {
        if(!season) {
          res.sendStatus(404);
          return Rx.Observable.throw(Error("bad"));
        }
        return Rx.Observable.of(season)
      })
      .flatMap((season: any) => {
        return leaderboardRepo.findSeasonBoard(season._id);
      })
      .flatMap((board: any) => {
        return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id)
      })
			.flatMap((userScores: any[]) => {
				return Rx.Observable.from(userScores);
			})	
      .map((userScore: any) => {
        return mapScore(userScore);
      })
      .toArray()
      .subscribe((userScores: any[]) => {
          res.status(200).json(userScores);
        }, (err: any) => {
          console.error(err);
          res.status(500).json(err);
        });
  }

  seasonRoundList(req: Request, res: Response) {
    let {league: leagueSlug, season: seasonSlug, round}= req.params;
    let source: Rx.Observable<any>;
    if(leagueSlug == null && seasonSlug == null) {
			source = seasonRepo.getDefault();
		} else {
			source = singleSeason(leagueSlug, seasonSlug)
		}
    source
			.flatMap((season: any) => {
				if(!season) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(season)
			})
      .flatMap((season: any) => {
        round = parseInt(round);
				return leaderboardRepo.findRoundBoard(season._id, round || season.currentRound);
			})
      .flatMap((board: any) => {
        if(board == null) {
          return Rx.Observable.empty();
        }
        return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id)
      })
			.flatMap((userScores: any[]) => {
				return Rx.Observable.from(userScores);
			})	
      .map((userScore: any) => {
        return mapScore(userScore);
      })
      .toArray()
      .subscribe((userScores: any[]) => {
          res.status(200).json(userScores);
        }, (err: any) => {
          console.error(err);
          res.status(500).json(err);
        });
  }
  
  seasonMonthList(req: Request, res: Response) {
    let {league: leagueSlug, season: seasonSlug, round, year, month}= req.params;
    let source: Rx.Observable<any>;
    if(leagueSlug == null && seasonSlug == null) {
      source = seasonRepo.getDefault();
    } else {
      source = singleSeason(leagueSlug, seasonSlug)
    }
    source
      .flatMap((season: any) => {
        if(!season) {
          res.sendStatus(404);
          return Rx.Observable.throw(Error("bad"));
        }
        return Rx.Observable.of(season)
      })
      .flatMap((season: any) => {
        return leaderboardRepo.findMonthBoard(season._id, year, month);
      })
      .flatMap((board: any) => {
        if(board == null) {
          return Rx.Observable.empty();
        }
        return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id)
      })
			.flatMap((userScores: any[]) => {
				return Rx.Observable.from(userScores);
			})	
      .map((userScore: any) => {
        return mapScore(userScore);
      })
      .toArray()
      .subscribe((userScores: any[]) => {
          res.status(200).json(userScores);
        }, (err: any) => {
          console.error(err);
          res.status(500).json(err);
        });
  }
  
  currentDefaults(req: Request, res: Response) {
    let defaultSeason:any = null;
    let source = seasonRepo.getDefault();
    source
      .flatMap((season: any) => {
        defaultSeason = season;
        return fixtureRepo.findAllBySeason(season._id)
      })
      .flatMap((fixtures: any[]) => {
        return Rx.Observable.from(fixtures);
      })	
      .reduce((acc: any, fixture: any) => {
        let {bestDiff, bestDate, closestFixture} = acc;
        if(bestDiff == null) {
          bestDiff = -(new Date(0,0,0)).valueOf()
          bestDate = fixture.date;
        }
        let now = Date.now();
        let currDiff = Math.abs(fixture.date - now);
        if(currDiff < bestDiff && fixture.status == 'FINISHED') {
          bestDiff = currDiff;
          bestDate = fixture.date;
          closestFixture = fixture;
        }
        acc = {bestDiff, bestDate, closestFixture};
        return acc;
      }, {})
      .subscribe((map: any) => {
        let {closestFixture} = map;
        let {_id:id, name, slug, year:sYear, league} = defaultSeason;
        let season  =  {id, name, slug, sYear}
        let round = closestFixture.round;    
        let date = closestFixture.date;
        let month = date.getUTCMonth() + 1;
        let year = date.getFullYear();
        let data = {
          league, season, round, month, year
        }
        res.status(200).json(data);
      }, (err: any) => {
        console.error(err);
        res.status(500).json(err);
      })
  }
}

function singleSeason(leagueId: string, seasonId: string) {
	let query: any;
	query = {$and: [{'league.slug': leagueId}, {slug: seasonId}]}
	let season = seasonRepo.findOne(query);
	return season;
}

function mapScore(userScore: any) {
  let score: any = {};
  score.user = userScore.user;
  score.points = userScore.points;
  score.goalDiff = userScore.goalDiff;
  score.rank = userScore.posNew;
  score.posNew = userScore.posNew;
  score.posOld = userScore.posOld;
  score.change = score.posOld - score.posNew;
  return score;
}