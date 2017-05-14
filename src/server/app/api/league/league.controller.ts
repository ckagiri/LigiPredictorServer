import {Request, Response} from 'express';
import * as _ from 'lodash';
import {League, ILeague, ILeagueModel} from '../../../db/models/league.model';
import {LeagueRepo, SeasonRepo, TeamRepo, FixtureRepo} from '../../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../../db/converters/ligi-predictor';
import isMongoId from '../../utils/isMongoId'
import * as Rx from 'rxjs';
let leagueRepo = new LeagueRepo(new LeagueConverter())
let seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
let teamRepo = new TeamRepo(new TeamConverter())
let fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, TeamRepo))

export class LeagueController {
  list(req: Request, res: Response) {
		leagueRepo.findAll()
			.subscribe((leagues: any[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	show(req: Request, res: Response) {
		let {id} = req.params;
		singleLeague(id)
			.subscribe((league: any) => {
					res.status(200).json(league);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

	listSeasons(req: Request, res: Response) {
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
				return seasonRepo.findByLeague(leagueId)
			})
			.subscribe((seasons: any[]) => {
					res.status(200).json(seasons);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
  }

	showSeason(req: Request, res: Response) {
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

	listTeams(req: Request, res: Response) {
		let {leagueId, seasonId}= req.params;
		singleSeason(leagueId, seasonId)
			.flatMap((season: any) => {
				if(!season) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(season)
			})
			.flatMap((season: any) => {
				return seasonRepo.getTeams(seasonId);
			})	
			.subscribe((teams: any[]) => {
					res.status(200).json(teams);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
	}

	listRounds(req: Request, res: Response) {
		let {leagueId, seasonId}= req.params;
 		singleSeason(leagueId, seasonId)
			.flatMap((season: any) => {
				if(!season) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(season)
			})
			.flatMap((season: any) => {
				return Rx.Observable.range(1, season.numberOfRounds || 38)
			})
			.map((rNum: number) => {
					return {
						round: `Round-${rNum}`
					}
				})
			.toArray()
			.subscribe((seasons: any[]) => {
					res.status(200).json(seasons);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
	}

	showRound(req: Request, res: Response) {
		let {leagueId, seasonId, roundId}= req.params;
		singleSeason(leagueId, seasonId)
			.flatMap((season: any) => {
				if(!season) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(season)
			})
			.map((season: any) => {
				return {round: roundId} // Todo:fetch single-round
			})
			.subscribe((round: any) => {
					res.status(200).json(round);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
	}

	listFixtures(req: Request, res: Response) {
		let {leagueId, seasonId, roundId}= req.params;
		leagueId = leagueId || req.query.league;
		seasonId = seasonId || req.query.league;
		roundId = roundId || req.query.league;
		singleSeason(leagueId, seasonId)
			.flatMap((season: any) => {
				if(!season) {
					res.sendStatus(404);
					return Rx.Observable.throw(Error("bad"));
				}
				return Rx.Observable.of(season)
			})
			.flatMap((season: any) => {
				if (roundId) {
					return fixtureRepo.findAllBySeasonRound(season._id, roundId);
				}
				return fixtureRepo.findAllBySeason(season._id);
			})	
			.subscribe((fixtures: any[]) => {
					res.status(200).json(fixtures);
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
	query = {$and: [{'league.slug': leagueId}, {slug: seasonId}]}
	let season = seasonRepo.findOne(query);
	return season;
}