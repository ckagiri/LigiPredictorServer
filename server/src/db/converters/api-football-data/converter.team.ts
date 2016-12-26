import { Observable } from 'rxjs/Observable';
import {api_data} from '../../providers';

class TeamConverter {
  from(obj: any) {
    return Observable.of({
      provider: {
        api_data: {
          id: obj.id
        }
      },
      name: obj.name,
      shortName: obj.shortName,
      crestUrl: obj.crestUrl
    });
  }
}