import {AbstractRepo} from './repo.abstract';
import {Season} from '../models/season.model';

export class SeasonRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Season, converter);
  }  

  findByYear(year: number){    
    return this.findAll({year});
  }
}