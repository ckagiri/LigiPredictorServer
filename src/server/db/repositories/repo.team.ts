import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {AbstractRepo} from './repo.abstract';
import {Team} from '../models/team.model';
const Promise = require('bluebird'); 

export class TeamRepo extends AbstractRepo {
  constructor(converter: any) {
    super(Team, converter);
  }  
}