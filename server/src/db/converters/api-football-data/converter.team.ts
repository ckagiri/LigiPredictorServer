import { Observable } from 'rxjs/Observable';
import {api_data} from '../../providers';

class TeamConverter {
  from(obj: any) {
    return Observable.of({
      api_detail: {
        [api_data]: {
          id: obj.id
        }
      },
      name: obj.name,
      shortName: obj.shortName,
      crestUrl: obj.crestUrl
    });
  }
}

export default new TeamConverter();