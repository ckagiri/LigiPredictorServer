import * as Rx from 'rxjs';
import {User} from '../models/user.model';

export class UserRepo {
  findOne(query: any, projection?: any){
    return Rx.Observable.fromPromise(User.findOne(query, projection));
  }

  findAll(query: any = {}, projection?: any, options?: any){
    return Rx.Observable.fromPromise(User.find(query, projection, options).lean());
  }
}