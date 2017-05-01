import {AbstractRepo} from './repo.abstract';
import {Fixture} from '../models/fixture.model';

export class FixtureRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Fixture, converter);
  }  
}