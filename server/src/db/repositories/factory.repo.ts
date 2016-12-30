import * as providers from '../providers';
import TeamRepo from './repo.team';
import SeasonRepo from './repo.season';

class RepoFactory {
  constructor(
    public teamRepo: any, 
    public seasonRepo: any
    ) { }
}

export default RepoFactory;