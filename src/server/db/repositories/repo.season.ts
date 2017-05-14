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
						if (!season) reject(new Error('Failed to load Fixture ' + seasonId));
						return resolve(season.teams);
					});
		}));
	}
}