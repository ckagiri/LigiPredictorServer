import {makeRequest} from '../utils';
import CompetitionApi from './competition';


class FootballApiClient{
  constructor(private apiKey: string){
  }

  getCompetitions(year: number){
    let queryParams = year ? {year} : undefined;
		let apiResource = "/competitions";

		return makeRequest(this.apiKey, apiResource, queryParams);
  }

  getCompetitionById(compId: any){
    return new CompetitionApi(this.apiKey, compId);
  }

  getFixtures() {
    return new Promise((resolve: any, reject: any) => {    
      setTimeout(() => {
        //LigiApiId
        resolve({

        });
      }, 1000);
    })
  }
}

export default FootballApiClient;