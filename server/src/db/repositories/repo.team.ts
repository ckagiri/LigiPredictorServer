import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {modelFactory} from './factory.model';
const Promise = require('bluebird'); 

export class TeamRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.teamModel, converter);
  }  

  findOneByNameAndUpdate(obj: any){
    const {name} = obj;   
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    let source = this.converter.from(obj);

    return source.flatMap((obj: any) => {
      let {api_detail} = obj;
      delete obj.api_detail;

      return Rx.Observable.fromPromise(
        new Promise((resolve: any, reject: any) => {    
          this.model.findOneAndUpdate(q, obj, {new: true}, 
            (err:any, updatedObj:any) => {
              if(err){
                return reject(err);
              }
              if(_.has(updatedObj, 'api_detail')){
                _.merge(updatedObj, {api_detail});
                updatedObj.markModified('api_detail');
              } else {
                _.extend(updatedObj, {api_detail});
              }
              updatedObj.save((err: any, savedObj: any) => {
                if (err) {
                  return reject(err);
                }
                resolve(savedObj);
              });
            });
        }));      
      }
    );
  }

  findByNameAndUpdate(objs: any[]){
    return Rx.Observable.fromPromise(
      Promise.all(objs.map((obj: any) => {
        return this.findOneByNameAndUpdate(obj);
      }))
    );
  }
}