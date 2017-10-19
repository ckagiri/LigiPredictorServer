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
		let predictionsDict = req.body;
		let errors: string[] = [];
		let user = req['user'];
		var reqPredictions = Object.keys(predictionsDict).map((key) => {
			return {
				_id: predictionsDict[key]._id,
				fixture: key, 
				user: user._id,
				choice: {
					goalsHomeTeam: predictionsDict[key].goalsHomeTeam,
					goalsAwayTeam: predictionsDict[key].goalsAwayTeam,
					isComputerGenerated: false 
				}
			}}).filter((reqPrediction: any) => {
				return reqPrediction.choice.goalsHomeTeam != null &&
					reqPrediction.choice.goalsAwayTeam != null;
			});
		
		Rx.Observable.from(reqPredictions)
			.flatMap((reqPrediction: any) => {
				return fixtureRepo.findOne({_id: reqPrediction.fixture})
					.map((fixture: any) => {
						return {
							fixture,
							reqPrediction
						}
					});
			})
			.switchMap((map: any) => {
				let {fixture, reqPrediction} = map;
				return predictionRepo.findOneAndUpdateOrCreate(user._id, fixture, reqPrediction.choice)
            .map(prediction => {
                return prediction;
            })
            .catch(error => {
							return Rx.Observable.of(error);
            });
			}).map(prediction => {
        if (prediction instanceof Error) {
					let message = `Error: ${prediction.message || 'damn'}`
						errors.push(message)
            return message;
        }
        return prediction;
    	})
			.subscribe((predictions: any[]) => {
				//do joker
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