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
	console.log("Data Update scheduled for " + date.format() + " - that's in " + msToTime(ms));
}

const scheduleFixturesUpdate = (date: any) => {
  let now = Moment();
	let ms = date - now;
	fixturesTimeout = setTimeout(() => updateFixtures(), ms);
	console.log("Fixtures Update scheduled for " + date.format() + " - that's in " + msToTime(ms));
}

const msToTime = (ms: number) => {
  let seconds: any = (ms / 1000).toFixed(0);
  let minutes: any = Math.floor(seconds / 60);
  let hours: any = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = minutes - (hours * 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}