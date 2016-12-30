import {config} from '../../../config/environment';
import {api_data} from '../../providers';

let provider = config.api_providers.api_football_data.name;

class TeamConverter {
  provider = provider;

  from(obj: any) {
    return {
      api_detail: {
        [this.provider]: {
          id: obj.id
        }
      },
      crestUrl: obj.crestUrl
    };
  }
}

export default new TeamConverter();