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
		let id = req.params.id;
		singleLeague(id)
			.subscribe((league: any) => {
					res.status(200).json(league);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	listSeasons (req: Request, res: Response) {
		let leagueId = req.params.leagueId;
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
		let leagueId = req.params.leagueId;
 		singleLeague(leagueId)
		 .subscribe((league: any) => {
				return res.sendStatus(404);
		 	}, (err: any) => {
				if (err) {
					return res.status(500).json(err);
				}
			});		
			
		let seasonId = req.params.leagueId;
		singleSeason(seasonId)
			.subscribe((league: any) => {
					res.status(200).json(league);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});
  }
}

function singleLeague(id: string) {
	return findOne(id, leagueRepo);
}

function singleSeason(id: string) {
  return findOne(id, seasonRepo);
}

function findOne(id: string, repo: any) {
  let one: Rx.Observable<any>;
  if (isMongoId(id)) {
    one = repo.findOne({_id: id});
  } else {
    one = repo.findOne({slug: id});
  }
  return one;
}




