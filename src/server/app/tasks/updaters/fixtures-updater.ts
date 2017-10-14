import * as Rx from 'rxjs';
import {client, fixtureRepo} from '../common'
import {fixtureDbUpdateHandler} from '../handlers/fixture-dbupdate';

let Moment = require('moment');
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
    //Rx.Observable.fromPromise(client.getFixtures(445, null))
    //   .subscribe((changedFixtures: any[]) => {
    //     fixtureDbUpdateHandler.handle(changedFixtures);
    //     callback(Moment().add(5, 'minutes')); 
    // })
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
                console.log('dbFixtures');
            console.log(dbFixtures);

          return {
            dbFixtures: dbFixtures,
            idToFixtureMap: idToFixtureMap
          }
        })
    })
    .subscribe((map: any) => {
      let changedFixtures = [];
      for (let dbFixture of map.dbFixtures) {
        let newFixture = map.idToFixtureMap[dbFixture.api_detail.id];
        if (fixtureChanged(newFixture, dbFixture)) {
            newFixture._id = dbFixture._id;
            console.log('fixtureChanged')
            console.log(newFixture);
            changedFixtures.push(newFixture);
        }
      }
      fixtureDbUpdateHandler.handle(changedFixtures);
      callback(Moment().add(15, 'minutes')); 
    })
  }
}

export const fixturesUpdater = new FixturesUpdater();