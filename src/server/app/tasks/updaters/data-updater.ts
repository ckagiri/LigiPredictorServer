import * as Rx from 'rxjs';
import * as _ from 'lodash';
import {client, fixtureRepo} from '../common'
import {seasonUpdateHandler} from '../handlers/season-dbupdate';
let Moment = require('moment');

class DataUpdater {
  update(callback: Function) {
    Rx.Observable.fromPromise(client.getCompetitions(2017))
		.subscribe(competitions => {
			seasonUpdateHandler.handle(competitions.data);
		})
    callback(Moment().add(1, 'days')); 
  }
}

export const dataUpdater = new DataUpdater();