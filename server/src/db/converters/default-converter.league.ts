import * as Rx from 'rxjs';

export class DefaultLeagueConverter {
  provider = 'LIGI';

  from(obj: any) {
    return Rx.Observable.of({
      api_detail: {
        [this.provider]: {
          id: obj.slug
        }
      },
      name: obj.name,
      code: obj.code,
      slug: obj.slug
    });
  }
}