import {dataUpdater} from './updaters/data-updater'
import {fixturesUpdater} from './updaters/fixtures-updater'
import {finishedFixtureDbUpdateHandler} from './handlers/finishedFixture-dbupdate';
import {fixtureRepo} from './common'

let schedule =	require('node-schedule');
let Moment = require('moment');
let dataTimeout: any;
let fixturesTimeout: any;

export const run = () => {
  updateData();
  //schedule.scheduleJob('*/15 * * * *', heartbeatCheck);
  heartbeatCheck();
}

const heartbeatCheck = () => {
  console.log("heartbeat");
  fixtureRepo.findAllFinishedWithPendingPredictions()
    .map((fixtures: any[]) => {
      finishedFixtureDbUpdateHandler.handle(fixtures)
    })
    .subscribe(
      (x: any) => {
        console.log(x);
      }, (err: any) => {
        console.log(err)
      }, () => {
        console.log('finished with pending preds done')
      });
}

const updateFixtures = () => {
  console.log("Fixtures update initiated");
  clearTimeout(fixturesTimeout);
  fixturesUpdater.update((date: any) => {
    scheduleFixturesUpdate(date);
  });
}

const updateData = () => {
  console.log("Data update initiated");
    
  dataUpdater.update((date: any) => {
    updateFixtures();
    scheduleDataUpdate(date);
  });
}

const scheduleDataUpdate = (date: any) => {
  let now = Moment();
	let ms = date - now;
	dataTimeout = setTimeout(() => updateData(), ms);
	console.log("Data Update scheduled for " + date.format() + " - that's in " + ms + "ms");
}

const scheduleFixturesUpdate = (date: any) => {
  let now = Moment();
	let ms = date - now;
	fixturesTimeout = setTimeout(() => updateFixtures(), ms);
	console.log("Fixtures Update scheduled for " + date.format() + " - that's in " + ms + "ms");
}