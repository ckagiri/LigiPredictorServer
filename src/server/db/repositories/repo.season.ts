import {AbstractRepo} from './repo.abstract';
import {modelFactory} from './factory.model';

export class SeasonRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.seasonModel, converter);
  }  

  findByYear(year: number){    
    return this.findAll({year});
  }
}