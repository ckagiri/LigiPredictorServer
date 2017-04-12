import * as Rx from 'rxjs';
import {config} from '../../../config/environment';

let provider = config.api_providers.api_football_data.name;

export class TeamConverter {
  provider = provider;

  from(obj: any) {
    return Rx.Observable.of({
      api_detail: {
        [this.provider]: {
          id: obj.id
        }
      },
      crestUrl: obj.crestUrl
    });
  }
}