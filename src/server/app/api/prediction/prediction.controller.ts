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
		if(req['user'] == null) {
			res.status(500).json({error: 'Unauthenticated'})
		}
		let predictionsDict = req.body.predictions;
		let user = req['user'];
		let errors: string[] = [];
		let reqPredictions = Object.keys(predictionsDict).map((key) => {
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
			.flatMap((map: any) => {
				let {fixture, reqPrediction} = map;
				let observable: any;
				if(fixture.status != 'SCHEDULED' && fixture.status != 'TIMED') {
					observable = Rx.Observable.throw(new Error(`${fixture.slug}: is not scheduled`))
				} else {
					observable =  predictionRepo.findOneAndUpdateOrCreate(user._id, fixture, reqPrediction.choice)
				}
        return observable.map((prediction:any) => prediction)
					.catch((error:any) => {
						let message = `Error: ${error.message || 'damn'}`
						errors.push(message)
						console.log("Caught Error, continuing")
						return  Rx.Observable.empty();
					});
			})
			.toArray()
			.subscribe((preds: any[]) => {
				let predictions = _.filter(preds, p => p !== null);
				res.status(200).json(predictions);
				}, (err: any) => {
					res.status(500).json(err);
    		});
	}

	pickJoker(req: Request, res: Response) {
		if(req['user'] == null) {
			res.status(500).json({error: 'Unauthenticated'})
		}
		let selectedFixture:any = req.body;
		let user = req['user']._id;
		let {_id: pick, season, round} = selectedFixture;
		let options = {
			user, season, round, pick
		}
		predictionRepo.pickJoker(options)
				.subscribe((joker: any) => {
					res.status(200).json(joker);
				}, (err: any) => {
					res.status(500).json(err);
    		});
	}

	mine(req: Request, res: Response) {
		fixtureRepo.findAll()
			.subscribe((fixtures: any[]) => {
					res.status(200).json(fixtures);
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