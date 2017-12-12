import * as Rx from 'rxjs';
import * as _ from 'lodash';
import {client, fixtureRepo} from '../common'
import {finishedFixtureDbUpdateHandler} from '../handlers/finishedFixture-dbupdate';
import {unfinishedFixtureDbUpdateHandler} from '../handlers/unfinishedFixture-dbupdate';

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

let calculateNextFixtureUpdateTime = (fixtureList: any[], callback: Function) => {
  let fixtureLive = false;
  let now = Moment();
  let next = Moment().add(1, 'year');
  let fixtures = _.filter(fixtureList, f => f.status !== 'FINISHED' );
  for(let fixture of fixtures) {
    if (fixture.status == "IN_PLAY") {
      fixtureLive = true;
    } else if (fixture.status == "SCHEDULED" || fixture.status == "TIMED") {
      // Parse fixture start date/time
      let fixtureStart = Moment(fixture.date);
      if (fixtureStart > now && fixtureStart < next) {
        next = fixtureStart;
      }
    }
  }
  let tomorrow = Moment().add(1, 'day');
  let update = next;
  if (fixtureLive) {
    update = Moment().add(3, 'minutes');
  } else if (next > tomorrow) {
    update = Moment().add(12, 'hours');
  }
  callback(update);
}

class FixturesUpdater {
  update(callback: Function) {
    Rx.Observable.zip(
      Rx.Observable.fromPromise(client.getFixtures(445,{timeFrame: 'p2'})),
      Rx.Observable.fromPromise(client.getFixtures(445,{timeFrame: 'n2'})),
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
    .subscribe(
      (map: any) => {
        let changedApiFixtures = [];
        let {dbFixtures, idToFixtureMap} = map;
        for (let dbFixture of dbFixtures) {
          let dbFixtureApiId = _.get(dbFixture, apiDetailIdKey, '');
          let apiFixture = idToFixtureMap[dbFixtureApiId];
          if (fixtureChanged(apiFixture, dbFixture)) {
            apiFixture._id = dbFixture._id;
            changedApiFixtures.push(apiFixture);
          }
        }
        let finishedFixtures = _.filter(changedApiFixtures, f => 
          f.status === 'CANCELED' || f.status === 'POSTPONED'|| f.status === 'FINISHED');
        let unfishedFixtures = _.filter(changedApiFixtures, f => 
          f.status !== 'CANCELED' && f.status !== 'POSTPONED' && f.status !== 'FINISHED');
        finishedFixtureDbUpdateHandler.handle(finishedFixtures);
        unfinishedFixtureDbUpdateHandler.handle(unfishedFixtures);
        let fixtureList = dbFixtures.concat(changedApiFixtures);
        calculateNextFixtureUpdateTime(fixtureList, callback)
      }, 
      (err: any) => { console.log(`Oops2... ${err}`) })
  }
}

export const fixturesUpdater = new FixturesUpdater();