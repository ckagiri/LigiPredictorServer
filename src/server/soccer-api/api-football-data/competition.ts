import {makeRequest} from '../utils';

class CompetitionApi {
  constructor(private apiKey: string, private id: any){    
  }

  getTeams() {
		let apiResource = "/competitions/" + this.id + "/teams";

		return makeRequest(this.apiKey, apiResource);
	}

  getFixtures(options?: any) {
		let queryParams = options ? options : undefined;
		let apiResource = "/competitions/" + this.id + "/fixtures";

		return makeRequest(this.apiKey, apiResource, queryParams);
	}
}

export default CompetitionApi;