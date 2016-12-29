import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';

export default class TeamRepo extends AbstractRepo {
  constructor(converter: any, provider: string, ) {
    super(modelFactory.teamModel, converter, provider);
  }
}