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
    var seasonId = "592a863caf45460c305e8649",
    return new Promise((resolve: any, reject: any) => {    
      setTimeout(() => {
        //LigiApiId
        resolve([{ //evetot
          id: "592a863caf45460c305e864d",
          season: seasonId,
          round: 1,
          status: 'PLAYED',
          result: {
            goalsHomeTeam: 1,
            goalsAwayTeam: 1
          }
        }, { //chewhu
          id: "592a863caf45460c305e864e",
          season: seasonId,
          round: 1,
          status: 'PLAYED',
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