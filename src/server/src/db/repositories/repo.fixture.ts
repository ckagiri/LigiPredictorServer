import {AbstractRepo} from './repo.abstract';
import {modelFactory} from './factory.model';

export class FixtureRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.fixtureModel, converter);
  }  
}