import * as Rx from 'rxjs';

abstract class AbstractRepo {
  constructor(public provider: string = "LIGI", public model: any, public converter: any){
  }

  insert(obj: any){
    let source = this.converter.from(obj);

    return source.flatMap((obj: any) => Rx.Observable.fromPromise(this.model.create(obj)))
  }

  insertMany(docs: any[]) {
    let convertedDocsObs: any[] = [];
    for (let doc of docs) {
      convertedDocsObs.push(this.converter.from(doc));
    }

    return Rx.Observable.zip(convertedDocsObs).flatMap;
  }

  updateDocs(conditions: any, doc: any, options: any){
    return this.model.update(conditions, doc, options);
  }

  update(conditions: any, doc: any){
    let options = {
      overwrite : false
    };
    return this.updateDocs(conditions, doc, options);
  }

  updateMany(conditions: any, doc: any){
    let options = {
      overwrite : true,
      multi: true
    };
    return this.updateDocs(conditions, doc, options);
  }

  delete(id: string){
    return this.model.remove({_id : id});
  }

  findOne(query: any, projection: any){
    return this.model.findOne(query, projection);
  }

  findAll(query: any, projection: any, options: any){
    return Rx.Observable.fromPromise(this.model.find(query, projection, options));
  }

  aggregate(query: any, group: any, sort: any){
    return this.model.aggregate({$match: query}).group(group).sort(sort);
  }

  idMapping(id: string) {
    return this.model.findOne()
      .where("api_detail.id").equals(id)
      .lean()
      .then(function (obj: any) {
          return Promise.resolve(obj ._id);
    });
  }
}

export default AbstractRepo;