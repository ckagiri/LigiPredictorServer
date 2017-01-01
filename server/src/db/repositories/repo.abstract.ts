import * as _ from 'lodash';
import * as Rx from 'rxjs';

let partial = {
  _id: null as string,
  name: null as string,
  slug: null as string,
};

export abstract class AbstractRepo {
  provider: string;

  constructor(public model: any, public converter: any){
    this.provider = converter.provider;
  }

  insert(obj: any){
    let source = this.converter.from(obj);

    return source.flatMap((obj: any) => {
      return Rx.Observable.fromPromise(this.model.create(obj));
    });
  }

  insertMany(objs: any[]) {
    let sources: any[] = [];
    for (let obj of objs) {
      sources.push(this.converter.from(obj));
    }
    return Rx.Observable.zip(sources)
      .flatMap(convertedObjs => {
        return Rx.Observable.fromPromise(this.model.insertMany(convertedObjs));
      });
  }

  update(conditions: any, doc: any, options: any = {overwrite: false}){
    return this.model.update(conditions, doc, options);
  }

  updateMany(conditions: any, doc: any){
    let options = {
      overwrite : true,
      multi: true
    };
    return this.update(conditions, doc, options);
  }

  delete(id: string){
    return this.model.remove({_id : id});
  }

  findOne(query: any, projection?: any){
    return this.model.findOne(query, projection);
  }

  findAll(query: any, projection?: any, options?: any){
    return this.model.find(query, projection, options);
  }

  aggregate(query: any, group: any, sort: any){
    return this.model.aggregate({$match: query}).group(group).sort(sort);
  }

  idMapping(id: string) {
    let objectId: string;
    id = id.toString();
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      objectId = id;
    } else {
      objectId = '4edd40c86762e0fb12000003'
    }
    let apiDetailId = `api_detail.${this.provider}.id`;
    return this.model.findOne()
      .or([{_id: objectId}, {[apiDetailId]: id}])
      .lean()
      .then(function (obj: any) {
        partial._id = obj._id;
        if(_.has(obj, 'name')){
          partial.name = obj.name;
        }
        if(_.has(obj, 'shortName')){
          partial.name = obj.shortName;
        }
        if(_.has(obj, 'slug')){
          partial.slug = obj.slug
        }
        return Promise.resolve(partial);
    });
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
    });
  }

  findByNameAndUpdate(objs: any[]): any{
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findOneByNameAndUpdate(obj));
    }
    
    return Rx.Observable.forkJoin(obs);
  }

  nameMapping(obj: any){
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return this.model.findOne(q)
      .then(function (obj: any) {
        partial._id = obj._id;
        if(_.has(obj, 'name')){
          partial.name = obj.name;
        }
        if(_.has(obj, 'shortName')){
          partial.name = obj.shortName;
        }
        if(_.has(obj, 'slug')){
          partial.slug = obj.slug
        }
        return Promise.resolve(partial);
    });
  }
}