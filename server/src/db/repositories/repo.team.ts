import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';
const Promise = require('bluebird'); 

export default class TeamRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.teamModel, converter);
  }  

  findByNameAndUpdate(obj: any){
    const {id, name} = obj;   
    let newObj: {api_detail: any};
    if(id){
      newObj.api_detail = {[this.provider]: {id}};
    }
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return this.model.update(q, newObj);
  }

  findByNameAndUpdateMany(objs: any[]){
    return Promise.all(objs.map(function (obj) {
      return this.findByNameAndUpdate(obj);
    }));
  }
}