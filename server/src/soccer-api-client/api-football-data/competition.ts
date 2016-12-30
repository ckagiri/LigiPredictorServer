import {makeRequest} from '../utils';

class CompetitionApi {
  constructor(private apiKey: string, private id: any){    
  }

  getTeams() {
		let apiResource = "/competitions/" + this.id + "/teams";

		return makeRequest(this.apiKey, apiResource);
	}
}

export default CompetitionApi;