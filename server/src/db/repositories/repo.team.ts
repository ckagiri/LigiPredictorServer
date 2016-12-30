import * as _ from 'lodash';
import AbstractRepo from './repo.abstract';
import modelFactory from './factory.model';
const Promise = require('bluebird'); 

export default class TeamRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.teamModel, converter);
  }  

  findOneByNameAndUpdate(obj: any){
    const {name} = obj;   
    let convertedObj = this.converter.from(obj);
    let {api_detail} = convertedObj;
    delete convertedObj.api_detail;
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return new Promise((resolve: any, reject: any) => {      
      this.model.findOneAndUpdate(q, convertedObj, {new: true}, 
        function(err:any, updatedObj:any){
          if(err){
            return reject(err);
          }
          _.merge(updatedObj, {api_detail});
          updatedObj.markModified('api_detail');
          updatedObj.save(function(err: any, savedObj: any) {
            if (err) {
              return reject(err);
            }
            resolve(savedObj);
          });
        }
      );
    });
  }

  findByNameAndUpdate(objs: any[]){
    return Promise.all(objs.map((obj: any) => {
      return this.findOneByNameAndUpdate(obj);
    }));
  }
}