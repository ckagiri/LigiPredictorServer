import {AbstractRepo} from './repo.abstract';
import {Season} from '../models/season.model';
import * as Rx from 'rxjs';

export class SeasonRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Season, converter);
  }  

	findAllByLeague(leagueId: string) {
		return this.findAll({'league.id': leagueId});
	}

	getTeams(seasonId: string) {
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				this.model.findOne({_id: seasonId})
					.populate('teams')
					.lean()
					.exec(function(err: any, season: any) {
						if (err) reject(err);
						if (!season) reject(new Error('Failed to load Season ' + seasonId));
						return resolve(season.teams);
					});
		}));
	}

	getDefault(){
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {
				this.model.findOne({'league.slug': 'premier-league', year: '2016'})
					.lean()
					.exec(function(err: any, season: any) {
						if (err) reject(err);
						if (!season) reject(new Error('Failed to load Default Season'));
							return resolve(season);
					});
			})
		)
	}

	updateCurrentRound(seasonId: any, round: number) {
		return this.update({_id: seasonId}, {$set: {currentRound: round}});
	}

	getByIds(ids: any[]) {
		return this.findAll({_id : {$in : ids}})
	}

	getByApiIds(apiIds: any[]) {
		return this.findAll({"api_detail.id" : {$in : apiIds}});
	}
}