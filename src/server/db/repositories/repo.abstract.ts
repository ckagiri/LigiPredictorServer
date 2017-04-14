import * as _ from 'lodash';
import * as Rx from 'rxjs';

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

  idMapping(id: any) {
    let objectId: string = id.toString();
    if (!objectId.match(/^[0-9a-fA-F]{24}$/)) {
      objectId = '4edd40c86762e0fb12000003' //dummy
    }
    let apiDetailId = `api_detail.${this.provider}.id`;
    return this.model.findOne()
      .or([{[apiDetailId]: id}, {_id: objectId}])
      .lean()
      .then(this.mapPartial);
  }  
  
  nameMapping(name: string){
    let q = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return this.model.findOne(q)
      .then(this.mapPartial);
  }  

  findByIdAndUpdate(id: any, obj: any){    
    let source = this.converter.from(obj);

    return source.flatMap((obj: any) => {   
      let {api_detail} = obj;
      delete obj.api_detail;
      let q = {_id: id}
      return Rx.Observable.fromPromise(this.findOneAndUpdate(q, obj, api_detail))
    });
  }

  findByApiIdAndUpdate(apiId: any, obj?: any){
    if (obj == undefined){
      obj = apiId;
      apiId = obj.id || obj.identifier;
    }  
    let source = this.converter.from(obj);

    return source.flatMap((obj: any) => { 
      let {api_detail} = obj;
      delete obj.api_detail;
      let apiDetailId = `api_detail.${this.provider}.id`;
      let q = {[apiDetailId]: apiId}
      return Rx.Observable.fromPromise(this.findOneAndUpdate(q, obj))
    });
  }

  findOneBySlugAndUpdate(obj: any){
   let source = this.converter.from(obj);

    return source.flatMap((obj: any) => {   
      let {api_detail, slug} = obj;
      delete obj.api_detail;
      let q = {slug}
      return Rx.Observable.fromPromise(this.findOneAndUpdate(q, obj, api_detail))
    });
  }

  findBySlugAndUpdate(objs: any[]): any{
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findOneBySlugAndUpdate(obj));
    }    
    return Rx.Observable.forkJoin(obs);
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
      return Rx.Observable.fromPromise(this.findOneAndUpdate(q, obj, api_detail));      
    });
  }

  findByNameAndUpdate(objs: any[]): any{
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findOneByNameAndUpdate(obj));
    }
    return Rx.Observable.forkJoin(obs);
  }  

  apiDetailIdKey() {
    return `api_detail.${this.provider}.id`;
  }

  getByApiId(apiId: any) {
    let apiDetailId = `api_detail.${this.provider}.id`;
    let query = {[apiDetailId]: apiId}
    return Rx.Observable.fromPromise(this.findOne(query));
  }

  getById(id: any) {
    return Rx.Observable.fromPromise(this.findOne({_id: id}));
  }

  private mapPartial (obj: any) {
    let partial = {
      _id: null as string,
      name: null as string,
      slug: null as string,
    };
    partial._id = obj._id;
    if(obj['name']){
      partial.name = obj.name;
    }
    if(obj['shortName']){
      partial.name = obj.shortName;
    }
    if(obj['slug']){
      partial.slug = obj.slug
    }
    return Promise.resolve(partial);
  }  

  private findOneAndUpdate(query: any, obj: any, apiDetail?: any){
    return new Promise((resolve: any, reject: any) => {    
      this.model.findOneAndUpdate(query, obj, {new: true, upsert: true}, 
        (err:any, updatedObj:any) => {
          if(err){
            return reject(err);
          }
          if(apiDetail == undefined) {
            resolve(updatedObj);
          } 
          else {
            if(updatedObj['api_detail']){
              _.merge(updatedObj, {api_detail: apiDetail});
              updatedObj.markModified('api_detail');
            } else {
              _.extend(updatedObj, {apiDetail: apiDetail});
            }
            updatedObj.save((err: any, savedObj: any) => {
              if (err) {
                return reject(err);
              }
              resolve(savedObj);
            });
          } 
        });
    });      
  }
}