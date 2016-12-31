import {AbstractRepo} from './repo.abstract';
import {modelFactory} from './factory.model';

export class LeagueRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.leagueModel, converter);
  }  
}