import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';

export default class TeamRepo extends AbstractRepo {
  constructor(converter: any, provider: string, ) {
    super(modelFactory.teamModel, converter, provider);
  }  

  findByNameAndUpdate(obj: any){
    const {id, name} = obj;   
    delete obj.id;
    delete obj.name;
    if(id){
      obj.api_detail = {[this.provider]: {id}};
    }
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return this.model.update(q, obj);
  }
}