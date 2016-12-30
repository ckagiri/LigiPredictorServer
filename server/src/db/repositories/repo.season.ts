import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';

export default class SeasonRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.seasonModel, converter);
  }  

  findByYear(year: number){    
    return this.findAll({year});
  }

  findOneByYearAndUpdate(obj: any){
    let newObj = this.converter.partial(obj)
    const {year} = obj;       
    let q = {year};
    return this.model.update(q, newObj);
  }
}