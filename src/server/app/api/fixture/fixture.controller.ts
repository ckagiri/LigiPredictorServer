import {Request, Response} from 'express';
import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {LeagueRepo, SeasonRepo, TeamRepo, FixtureRepo, PredictionRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../../db/converters/ligi-predictor';
import isMongoId from '../../utils/isMongoId'

let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
let teamRepo = new TeamRepo(new TeamConverter())
let fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, TeamRepo))
let predictionRepo = new PredictionRepo();

export class FixtureController { 
	show(req: Request, res: Response) {
		let {id} = req.params;
		singleFixture(id)
			.subscribe((fixture: any) => {
					res.status(200).json(fixture);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

  list(req: Request, res: Response) {
		let {league: leagueSlug, season: seasonSlug, round: matchday}= req.query;
		matchday = matchday && matchday.split('-').pop();
		let user = req['user'];
		let userId = user && user._id;
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
				return fixtureRepo.findAllBySeasonRound(season._id, matchday || season.currentRound);
			})
			.flatMap((fixtures: any[]) => {
				return Rx.Observable.from(fixtures);
			})	
			.flatMap((fixture: any) => {
				if(userId == null) {
					return Rx.Observable.of({
						fixture, prediction: {fixture: fixture._id}
					})
				}
				return predictionRepo.findOneOrCreate(userId, fixture._id, fixture.odds)
					.map((prediction) => {
						return {
							fixture, prediction
						}})
			})
			.flatMap((map: any) => {
				let {fixture, prediction} = map;
				fixture.prediction = prediction;
				return Rx.Observable.of(fixture)
			})
			.toArray()
			.subscribe((fixtures: any[]) => {
					res.status(200).json(fixtures);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
	}
}

function singleFixture(id: string) {
	let fixture: Rx.Observable<any>;
  if (isMongoId(id)) {
    fixture = fixtureRepo.findOne({_id: id});
  } else {
    fixture = fixtureRepo.findOne({slug: id});
  }
  return fixture;
}

function singleSeason(leagueId: string, seasonId: string) {
	let query: any;
	query = {$and: [{'league.slug': leagueId}, {slug: seasonId}]}
	let season = seasonRepo.findOne(query);
	return season;
}