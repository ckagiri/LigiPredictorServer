import {Request, Response} from 'express';
import * as _ from 'lodash';
import {League, ILeague, ILeagueModel} from '../../../db/models/league.model';
import {LeagueRepo, SeasonRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter} from '../../../db/converters/ligi-predictor';
import isMongoId from '../../utils/isMongoId'
import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));

export class LeagueController {
  list (req: Request, res: Response) {
		leagueRepo.findAll()
			.subscribe((leagues: any[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	show (req: Request, res: Response) {
		let {id} = req.params;
		singleLeague(id)
			.subscribe((league: any) => {
					res.status(200).json(league);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	listSeasons (req: Request, res: Response) {
		let {leagueId}= req.params;
 		singleLeague(leagueId)
			.flatMap((league: any) => {
				if(!league) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(league)
			})
			.flatMap((league: any) => {
				return seasonRepo.findAll()
			})
			.subscribe((seasons: any[]) => {
					res.status(200).json(seasons);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
  }

	showSeason (req: Request, res: Response) {
		let {leagueId, seasonId} = req.params;
 		singleLeague(leagueId)
		 	.flatMap((league: any) => {
				if(!league) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(league)
			})
			.flatMap((league: any) => {
				return singleSeason(leagueId, seasonId);
			})
			.subscribe((season: any) => {
					res.status(200).json(season);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }
}

function singleLeague(id: string) {
	let league: Rx.Observable<any>;
  if (isMongoId(id)) {
    league = leagueRepo.findOne({_id: id});
  } else {
    league = leagueRepo.findOne({slug: id});
  }
  return league;
}

function singleSeason(leagueId: string, seasonId: string) {
	let query: any;
  if(isMongoId(leagueId)) {
		if(isMongoId(seasonId)) {
			query = {$and: [{'league.id': leagueId}, {_id: seasonId}]}
		} else {
			query = {$and: [{'league.id': leagueId}, {slug: seasonId}]}
		}
	} else {
		if(isMongoId(seasonId)){
			query = {$and: [{'league.slug': leagueId}, {_id: seasonId}]}
		} else{
			query = {$and: [{'league.slug': leagueId}, {slug: seasonId}]}
		}
	}
	let season = seasonRepo.findOne(query);
	return season;
}




