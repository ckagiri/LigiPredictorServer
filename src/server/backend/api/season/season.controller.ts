import {Request, Response} from 'express';
import * as _ from 'lodash';
import {Season, ISeason, ISeasonModel} from '../../../db/models/season.model';
import {LeagueRepo, SeasonRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter} from '../../../db/converters/ligi-predictor';

import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));

export class SeasonController {
  show (req: Request, res: Response) {
    let slug = req.params.leagueId;
		seasonRepo.findAll({'league.slug': slug})
			.subscribe((seasons: any[]) => {
					res.status(200).json(seasons);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }
}