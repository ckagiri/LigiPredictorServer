import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {modelFactory} from './factory.model';
const Promise = require('bluebird'); 

export class TeamRepo extends AbstractRepo {
  constructor(converter: any) {
    super(modelFactory.teamModel, converter);
  }  
}