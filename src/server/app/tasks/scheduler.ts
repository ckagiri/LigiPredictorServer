import {dataUpdater} from './updaters/data-updater'
import {fixturesUpdater} from './updaters/fixtures-updater'
import {finishedFixtureDbUpdateHandler} from './handlers/finishedFixture-dbupdate';
import {seasonRepo, fixtureRepo} from './common'

let schedule =	require('node-schedule');
let Moment = require('moment');
let dataTimeout: any;
let fixturesTimeout: any;

export const run = () => {
  updateData();
  schedule.scheduleJob('*/15 * * * *', heartbeatCheck);
  //heartbeatCheck();
}

const heartbeatCheck = () => {
  console.log("heartbeat");
  seasonRepo.getDefault()
    .flatMap((season: any) => {
      return fixtureRepo.findAllFinishedWithPendingPredictions(season._id, season.currentRound)
        .map((fixtures: any[]) => {
          finishedFixtureDbUpdateHandler.handle(fixtures, true)
        })
      })
      .subscribe(
        (_: any) => {
          console.log("finished with preds");
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
	console.log("Data Update scheduled for " + date.format() + " - that's in " + millisToMinutesAndSeconds(ms) + "  mins:secs");
}

const scheduleFixturesUpdate = (date: any) => {
  let now = Moment();
	let ms = date - now;
	fixturesTimeout = setTimeout(() => updateFixtures(), ms);
	console.log("Fixtures Update scheduled for " + date.format() + " - that's in " + millisToMinutesAndSeconds(ms) + "  mins:secs");
}

const millisToMinutesAndSeconds = (millis: number) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = parseFloat(((millis % 60000) / 1000).toFixed(0));
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}