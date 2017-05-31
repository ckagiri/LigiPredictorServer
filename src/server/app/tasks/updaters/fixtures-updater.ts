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
  callback(Moment().add(3, 'seconds')); 

    // Rx.Observable.fromPromise(client.getFixtures())
    //   .subscribe((changedFixtures: any[]) => {
    //     fixtureDbUpdateHandler.handle(changedFixtures);
    // })
    // .map((fixtures: any[]) => {
    //   return createIdToFixtureMap(fixtures);
    // })
    // .flatMap((idToFixtureMap) => {
    //   return fixtureRepo.getByApiIds(Object.keys(idToFixtureMap))
    //     .map((dbFixtures: any[]) => {
    //       return {
    //         dbFixtures: dbFixtures,
    //         idToFixtureMap: idToFixtureMap
    //       }
    //     })
    // })
    // .subscribe((map: any) => {
    //   let changedFixtures = [];
    //   for (let dbFixture of map.dbFixtures) {
    //     let newFixture = map.idToFixtureMap[dbFixture.api_detail.id];
    //     if (fixtureChanged(newFixture, dbFixture)) {
    //         newFixture._id = dbFixture._id;
    //         changedFixtures.push(newFixture);
    //     }
    //   }
    //   fixtureDbUpdateHandler.handle(changedFixtures);
    // })
  }
}

export const fixturesUpdater = new FixturesUpdater();