"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_updater_1 = require("./updaters/data-updater");
var fixtures_updater_1 = require("./updaters/fixtures-updater");
var schedule = require('node-schedule');
var Moment = require('moment');
var dataTimeout;
var fixturesTimeout;
exports.run = function () {
    updateData();
    schedule.scheduleJob('*/15 * * * *', heartbeatCheck);
};
var heartbeatCheck = function () {
    console.log("heartbeat");
};
var updateFixtures = function () {
    console.log("Fixtures update initiated");
    clearTimeout(fixturesTimeout);
    fixtures_updater_1.fixturesUpdater.update(function (date) {
        scheduleFixturesUpdate(date);
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
    console.log("Data Update scheduled for " + date.format() + " - that's in " + ms + "ms");
};
var scheduleFixturesUpdate = function (date) {
    var now = Moment();
    var ms = date - now;
    fixturesTimeout = setTimeout(function () { return updateFixtures(); }, ms);
    console.log("Fixtures Update scheduled for " + date.format() + " - that's in " + ms + "ms");
};
//# sourceMappingURL=scheduler.js.map