import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';

class TeamRepo extends AbstractRepo {
  constructor(provider: string, converter: any) {
    super(provider, modelFactory.teamModel, converter);
  }
}