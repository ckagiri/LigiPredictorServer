import * as Rx from 'rxjs';

export class DefaultSeasonConverter {
  provider = 'LIGI';

  constructor(private leagueRepo: any){ }

  from(obj: any): any {
    return Rx.Observable.fromPromise(this.leagueRepo.idMapping(obj.leagueId))
      .flatMap(function (league: any) {
        return Rx.Observable.of({
          api_detail: {
            [this.provider]: {
              id: obj.slug
            }
          },
          league: {
            id: league.id,
            name: league.name,
            slug: league.slug
          },
          name: obj.name,
          slug: obj.slug,
          year: obj.year
        });
      });
  }
}