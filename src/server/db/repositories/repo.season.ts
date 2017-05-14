import {AbstractRepo} from './repo.abstract';
import {Season} from '../models/season.model';
import * as Rx from 'rxjs';

export class SeasonRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Season, converter);
  }  

  findByYear(year: number){    
    return this.findAll({year});
  }

	findByLeague(leagueId: string) {
		return this.findAll({leagueId});
	}

	getTeams(seasonId: string) {
		return Rx.Observable.fromPromise(
			this.model.find({seasonId}).populate('teams').exec(function(err: any, season: any) {
			if (err) throw('Bad');
			if (!season) throw(new Error('Failed to load Fixture ' + seasonId));
			return season.teams;
		}));
	}
}