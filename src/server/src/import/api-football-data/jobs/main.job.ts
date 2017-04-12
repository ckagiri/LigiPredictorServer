import {config} from '../../../config/environment';
import Client from '../../../soccer-api-client/api-football-data';
import CompetitionJob from './competition.job';
export const client = new Client(config.api_providers.api_football_data.apiKey);

export class MainJob {
  start(queue: any){
    console.log("Main job")
    return client.getCompetitions(2016).then(({data: competitions}) => {
      for (let competition of competitions) {
        let compJob = new CompetitionJob(competition);      
         if (competition.id !== 426) {
          continue;
        }  
        queue.addJob(compJob);
      }
    }).catch((err: any) => {
      console.error(err);
    });
  }
}