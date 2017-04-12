import * as Rx from 'rxjs';

export class DefaultTeamConverter {
  provider = 'LIGI';

  from(obj: any) {
    return Rx.Observable.of({
      api_detail: {
        [this.provider]: {
          id: obj.slug
        }
      },
      name: obj.name,
      shortName: obj.shortName,
      code: obj.code,
      slug: obj.slug,
      aliases: obj.aliases
    });
  }
}