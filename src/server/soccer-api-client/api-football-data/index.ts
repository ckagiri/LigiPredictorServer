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
    var seasonId2 = "592bef2018d2d02620b2dbd9";
    var fixture1 = "592b2483f9e52d41b0007db8";
    var fixture11 = "592bef2018d2d02620b2dbdd";
    var fixture2 = "592b2483f9e52d41b0007db9";
    var fixture22 = "592bef2018d2d02620b2dbde";
    return new Promise((resolve: any, reject: any) => {    
      setTimeout(() => {
        //LigiApiId
        resolve([{ //evetot
          _id: fixture11,
          season: seasonId2,
          round: 1,
          status: 'FINISHED',
          result: {
            goalsHomeTeam: 1,
            goalsAwayTeam: 1
          }
        }, { //chewhu
          _id: fixture22,
          season: seasonId2,
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