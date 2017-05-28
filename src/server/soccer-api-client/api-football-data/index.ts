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
    var seasonId = "592b2483f9e52d41b0007db4";
    return new Promise((resolve: any, reject: any) => {    
      setTimeout(() => {
        //LigiApiId
        resolve([{ //evetot
          _id: "592b2483f9e52d41b0007db8",
          season: seasonId,
          round: 1,
          status: 'FINISHED',
          result: {
            goalsHomeTeam: 1,
            goalsAwayTeam: 1
          }
        }, { //chewhu
          _id: "592b2483f9e52d41b0007db9",
          season: seasonId,
          round: 1,
          status: 'FINISHED',
          result: {
            goalsHomeTeam: 2,
            goalsAwayTeam: 1
          }
        }]);
      }, 1000);
    })
  }
}

export default FootballApiClient;