import {AbstractRepo} from './repo.abstract';
import {League} from '../models/league.model';

export class LeagueRepo extends AbstractRepo {
  constructor(converter: any) {
    super(League, converter);
  }  
}