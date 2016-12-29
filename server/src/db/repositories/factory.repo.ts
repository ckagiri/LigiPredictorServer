import * as providers from '../providers';
import teamConverter from '../converters/api-football-data/converter.team';
import TeamRepo from './repo.team';

class RepoFactory {
  constructor(){
    this.teamRepo = new TeamRepo(teamConverter, providers.api_data)
  }
  teamRepo: any
}

export default new RepoFactory();