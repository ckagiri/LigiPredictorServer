import * as _ from 'lodash';

let partial = {
    _id: null as string,
    name: null as string,
    slug: null as string,
};

abstract class AbstractRepo {
  provider: string;

  constructor(public model: any, public converter: any){
    this.provider = converter.provider;
  }

  insert(obj: any){
    let convertedObj = this.converter.from(obj);

    return this.model.create(convertedObj);
  }

  insertMany(objs: any[]) {
    let convertedObjs: any[] = [];
    for (let obj of objs) {
      convertedObjs.push(this.converter.from(obj));
    }
    
    return this.model.insertMany(convertedObjs);
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
}

export default AbstractRepo;