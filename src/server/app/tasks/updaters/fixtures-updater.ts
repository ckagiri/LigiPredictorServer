import * as Rx from 'rxjs';
import * as _ from 'lodash';
import {client, fixtureRepo} from '../common'
import {finishedFixtureDbUpdateHandler} from '../handlers/finishedFixture-dbupdate';

let Moment = require('moment');
let apiDetailIdKey = fixtureRepo.apiDetailIdKey();
let createIdToFixtureMap = (fixtures: any[]) => {
  let map = {};
  for (let fixture of fixtures) {
      map[fixture.id] = fixture;
  }
  return map;
}

let fixtureChanged = (updated: any, fromDb: any) => {
  if (updated.status !== fromDb.status) {
    return true;
  }
  if (updated.result.goalsHomeTeam !== fromDb.result.goalsHomeTeam ||
    updated.result.goalsAwayTeam !== fromDb.result.goalsAwayTeam) {
    return true;
  }
  if (updated.odds) {
    if (!fromDb.odds) {
      return true;
    }
    if (updated.odds.homeWin !== fromDb.odds.homeWin ||
      updated.odds.awayWin !== fromDb.odds.awayWin ||
      updated.odds.draw !== fromDb.odds.draw) {
      return true;
    }
  }
  return false;
}
class FixturesUpdater {
  update(callback: Function) {
    Rx.Observable.zip(
      Rx.Observable.fromPromise(client.getFixtures(445,{timeFrame: 'p1'})),
      Rx.Observable.fromPromise(client.getFixtures(445,{timeFrame: 'n1'})),
      function (changeYesterday:any, todayAndTomorrow:any) {
        changeYesterday = changeYesterday.data.fixtures;
        todayAndTomorrow = todayAndTomorrow.data.fixtures;
        return changeYesterday.concat(todayAndTomorrow);
    })
    .map((fixtures: any[]) => {
      return createIdToFixtureMap(fixtures);
    })
    .flatMap((idToFixtureMap) => {
      return fixtureRepo.getByApiIds(Object.keys(idToFixtureMap))
        .map((dbFixtures: any[]) => {
          return {
            dbFixtures: dbFixtures,
            idToFixtureMap: idToFixtureMap
          }
        })
    })
    .subscribe((map: any) => {
      let changedFixtures = [];
      let {dbFixtures, idToFixtureMap} = map;
      for (let dbFixture of dbFixtures) {
        let dbFixtureId = _.get(dbFixture, apiDetailIdKey, '');
        let newFixture = idToFixtureMap[dbFixtureId];
        if (fixtureChanged(newFixture, dbFixture)) {
            newFixture._id = dbFixture._id;
            console.log('fixtureChanged')
            console.log(newFixture);
            changedFixtures.push(newFixture);
        }
      }
      let finishedFixtures = _.filter(changedFixtures, {status: 'FINISHED'});
      finishedFixtureDbUpdateHandler.handle(finishedFixtures);
      callback(Moment().add(15, 'minutes')); 
    })
  }
}

export const fixturesUpdater = new FixturesUpdater();