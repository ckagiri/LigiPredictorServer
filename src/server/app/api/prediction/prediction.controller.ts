import {Request, Response} from 'express';
import * as _ from 'lodash';
import {IPrediction, Prediction	} from '../../../db/models/prediction.model';
import {LeagueRepo, SeasonRepo, TeamRepo, FixtureRepo, PredictionRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../../db/converters/ligi-predictor';
import * as Rx from 'rxjs';

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

	create(req: Request, res: Response) {
		let predictions = req.body;
		let user = req['user'];
		let arr = [];
		for(let key in predictions){
			let prediction: IPrediction = {
				user: user._id,
				choice: {
					goalsHomeTeam: predictions[key].goalsHomeTeam,
					goalsAwayTeam: predictions[key].goalsAwayTeam,
					isComputerGenerated: false 
				},
				fixture: key	
			}
			prediction['_id'] = predictions[key]['_id'];
			let pred = new Prediction(prediction);
			pred.isNew = false;
			arr.push(pred); 
		}
		
		predictionRepo.create(arr)
			.subscribe((predictions: any[]) => {
					res.status(200).json(predictions);
				}, (err: any) => {
					res.status(500).json(err);
    		});
		}

	mine(req: Request, res: Response) {
		fixtureRepo.findAll()
			.subscribe((leagues: any[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
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