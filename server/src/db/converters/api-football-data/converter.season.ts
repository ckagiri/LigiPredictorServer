import {config} from '../../../config/environment';
import DefaultSeasonConverter from '../default-converter.season';

let provider = config.api_providers.api_football_data.name;

class SeasonConverter {
  provider = provider;

  from(obj: any): any {
    return {
      api_detail: {
        [this.provider]: {
          id: obj.id
        }
      }
    };
  }
}

export default new SeasonConverter();