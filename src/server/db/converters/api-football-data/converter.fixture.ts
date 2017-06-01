import * as Rx from 'rxjs';
import {config} from '../../../config/environment';

let provider = config.api_providers.api_football_data.name;

export class FixtureConverter {
  provider = provider;

  constructor(private seasonRepo: any, private teamRepo: any){ }
  
  from(obj: any): any {
    return Rx.Observable.zip(
			Rx.Observable.fromPromise(this.seasonRepo.idMapping(obj.seasonId)),
			Rx.Observable.fromPromise(this.teamRepo.nameMapping(obj.homeTeamName)),
			Rx.Observable.fromPromise(this.teamRepo.nameMapping(obj.awayTeamName)),
			(season: any, homeTeam: any, awayTeam: any) => {
				return {
					api_detail: {
            [this.provider]: {
              id: obj.id
            }
          },
					season: season._id,
					round: obj.matchday,
					date: new Date(obj.date),
          status: obj.status,
					homeTeam: {
            slug: homeTeam.slug,
						name: homeTeam.name,
						id: homeTeam._id,
						crestUrl: homeTeam.crestUrl
					},
					awayTeam: {
            slug: awayTeam.slug,
						name: awayTeam.name,
						id: awayTeam._id,
						crestUrl: awayTeam.crestUrl
					},
          slug: `${homeTeam.slug}-${awayTeam.slug}`,
					result: {
						goalsHomeTeam: obj.result.goalsHomeTeam,
						goalsAwayTeam: obj.result.goalsAwayTeam
					},
					odds: obj.odds
				}
			}
		);
  }
}