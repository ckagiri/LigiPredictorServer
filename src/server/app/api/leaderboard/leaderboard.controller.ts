import {Request, Response} from 'express';
import * as _ from 'lodash';
import {Leaderboard, ILeaderboard, ILeaderboardModel} from '../../../db/models/leaderboard.model';
import {LeagueRepo, SeasonRepo, LeaderboardRepo, UserScoreRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter} from '../../../db/converters/ligi-predictor';
import isMongoId from '../../utils/isMongoId'

import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
let leaderboardRepo = new LeaderboardRepo();
let userScoreRepo = new UserScoreRepo();

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
    let {league: leagueSlug, season: seasonSlug}= req.query;
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
      .map((userScore: any) => {
        return userScore;
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
    let {league: leagueSlug, season: seasonSlug, round}= req.query;
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
				return leaderboardRepo.findRoundBoard(season._id, round || season.currentRound);
			})
      .flatMap((board: any) => {
        return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id)
      })
      .subscribe((userScores: any[]) => {
          res.status(200).json(userScores);
        }, (err: any) => {
          console.error(err);
          res.status(500).json(err);
        });
  }
  
  seasonMonthList(req: Request, res: Response) {
    let {league: leagueSlug, season: seasonSlug, round, year, month}= req.query;
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
        return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id)
      })
      .subscribe((userScores: any[]) => {
          res.status(200).json(userScores);
        }, (err: any) => {
          console.error(err);
          res.status(500).json(err);
        });
  }
}

function singleSeason(leagueId: string, seasonId: string) {
	let query: any;
	query = {$and: [{'league.slug': leagueId}, {slug: seasonId}]}
	let season = seasonRepo.findOne(query);
	return season;
}