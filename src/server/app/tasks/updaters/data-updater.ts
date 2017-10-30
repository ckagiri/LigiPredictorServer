import * as Rx from 'rxjs';
import * as _ from 'lodash';
import {client, fixtureRepo} from '../common'
import {seasonUpdateHandler} from '../handlers/season-dbupdate';
let Moment = require('moment');

class DataUpdater {
  update(callback: Function) {
    Rx.Observable.fromPromise(client.getCompetitions(2017))
		.subscribe(
      (competitions: any) => {
        seasonUpdateHandler.handle(competitions.data);
		  },
      (err: any) => { console.log(`Oops... ${err}`) })
    callback(Moment().add(1, 'days')); 
  }
}

export const dataUpdater = new DataUpdater();