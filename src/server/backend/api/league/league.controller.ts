import {Request, Response} from 'express';
import * as _ from 'lodash';
import {League, ILeague, ILeagueModel} from '../../../db/models/league.model';
import {LeagueRepo} from '../../../db/repositories/repo.league';
import {LeagueConverter} from '../../../db/converters/ligi-predictor/converter.league';
import isMongoId from '../../utils/isMongoId'
import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter());

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

