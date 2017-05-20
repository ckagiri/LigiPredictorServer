import {Request, Response} from 'express';
import * as _ from 'lodash';
import {IPrediction, Prediction	} from '../../../db/models/prediction.model';
import {LeagueRepo, SeasonRepo, TeamRepo, FixtureRepo, PredictionRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../../db/converters/ligi-predictor';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
let teamRepo = new TeamRepo(new TeamConverter())
let fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, TeamRepo))
let predictionRepo = new PredictionRepo();

export class PredictionController {
	list(req: Request, res: Response) {
		fixtureRepo.findAll()
			.subscribe((leagues: any[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	mine(req: Request, res: Response) {
		fixtureRepo.findAll()
			.subscribe((leagues: any[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	show(req: Request, res: Response) {
		let {id} = req.params;
		fixtureRepo.findOne({_id: id})		
			.subscribe((league: any) => {
				res.status(200).json(league);
			}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
			});
  }
}

function createPredictionNullo(fixtureId: string) {
	return {
		fixture: fixtureId
	}
}