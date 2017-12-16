"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_updater_1 = require("./updaters/data-updater");
var fixtures_updater_1 = require("./updaters/fixtures-updater");
var finishedFixture_dbupdate_1 = require("./handlers/finishedFixture-dbupdate");
var common_1 = require("./common");
var schedule = require('node-schedule');
var Moment = require('moment');
var dataTimeout;
var fixturesTimeout;
var nextMatchUpdateDate;
var previousMatchUpdateMs = 0;
var nextMatchUpdateMs = 0;
exports.run = function () {
    updateData();
    schedule.scheduleJob('*/15 * * * *', heartbeatCheck);
};
exports.nextMatchUpdate = function () {
    return { nextMatchUpdateMs: nextMatchUpdateMs, previousMatchUpdateMs: previousMatchUpdateMs, nextMatchUpdateDate: nextMatchUpdateDate };
};
var heartbeatCheck = function () {
    console.log("heartbeat");
    common_1.seasonRepo.getDefault()
        .flatMap(function (season) {
        return common_1.fixtureRepo.findAllFinishedWithPendingPredictions(season._id)
            .map(function (fixtures) {
            finishedFixture_dbupdate_1.finishedFixtureDbUpdateHandler.handle(fixtures, true);
        });
    })
        .subscribe(function (_) {
        console.log("finished with preds");
    }, function (err) {
        console.log(err);
    }, function () {
        console.log('finished with pending preds done');
    });
};
var updateFixtures = function () {
    console.log("Fixtures update initiated");
    clearTimeout(fixturesTimeout);
    previousMatchUpdateMs = nextMatchUpdateMs;
    fixtures_updater_1.fixturesUpdater.update(function (date, callback) {
        scheduleFixturesUpdate(date);
        callback();
    });
};
var updateData = function () {
    console.log("Data update initiated");
    data_updater_1.dataUpdater.update(function (date) {
        updateFixtures();
        scheduleDataUpdate(date);
    });
};
var scheduleDataUpdate = function (date) {
    var now = Moment();
    var ms = date - now;
    dataTimeout = setTimeout(function () { return updateData(); }, ms);
    console.log("Data Update scheduled for " + date.format() + " - that's in " + exports.msToTime(ms));
};
var scheduleFixturesUpdate = function (date) {
    var now = Moment();
    var ms = date - now;
    fixturesTimeout = setTimeout(function () { return updateFixtures(); }, ms);
    nextMatchUpdateMs = ms;
    nextMatchUpdateDate = date.format();
    console.log("Fixtures Update scheduled for " + date.format() + " - that's in " + exports.msToTime(ms));
};
exports.msToTime = function (ms) {
    var seconds = (ms / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
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
};
//# sourceMappingURL=scheduler.js.map