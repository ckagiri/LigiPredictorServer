import * as Rx from 'rxjs';
import {config} from '../../../config/environment';

let provider = config.api_providers.api_football_data.name;

export class SeasonConverter {
  provider = provider;
  
  from(obj: any): any {
    return Rx.Observable.of({
      api_detail: {
        [this.provider]: {
          id: obj.id
        }
      }
    });
  }
}