"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var _ = require("lodash");
var common_1 = require("../common");
var finishedFixture_dbupdate_1 = require("../handlers/finishedFixture-dbupdate");
var apiFixture_dbupdate_1 = require("../handlers/apiFixture-dbupdate");
var async_1 = require("async");
var Moment = require('moment');
var apiDetailIdKey = common_1.fixtureRepo.apiDetailIdKey();
var createIdToFixtureMap = function (fixtures) {
    var map = {};
    for (var _i = 0, fixtures_1 = fixtures; _i < fixtures_1.length; _i++) {
        var fixture = fixtures_1[_i];
        map[fixture.id] = fixture;
    }
    return map;
};
var fixtureChanged = function (updated, fromDb) {
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
};
var calculateNextFixtureUpdateTime = function (fixtureList) {
    var fixtureLive = false;
    var now = Moment();
    var next = Moment().add(1, 'year');
    var fixtures = _.filter(fixtureList, function (f) { return f.status !== 'FINISHED'; });
    for (var _i = 0, fixtures_2 = fixtures; _i < fixtures_2.length; _i++) {
        var fixture = fixtures_2[_i];
        if (fixture.status == "IN_PLAY") {
            fixtureLive = true;
        }
        else if (fixture.status == "SCHEDULED" || fixture.status == "TIMED") {
            // Parse fixture start date/time
            var fixtureStart = Moment(fixture.date).subtract(5, 'minutes');
            if (fixtureStart > now && fixtureStart < next) {
                next = fixtureStart;
            }
        }
    }
    var tomorrow = Moment().add(1, 'day');
    var update = next;
    if (fixtureLive) {
        update = Moment().add(3, 'minutes');
    }
    else if (next > tomorrow) {
        update = Moment().add(12, 'hours');
    }
    return update;
};
var FixturesUpdater = (function () {
    function FixturesUpdater() {
    }
    FixturesUpdater.prototype.update = function (callback) {
        Rx.Observable.zip(Rx.Observable.fromPromise(common_1.client.getFixtures(445, { timeFrame: 'p2' })), Rx.Observable.fromPromise(common_1.client.getFixtures(445, { timeFrame: 'n2' })), function (changeYesterday, todayAndTomorrow) {
            changeYesterday = changeYesterday.data.fixtures;
            todayAndTomorrow = todayAndTomorrow.data.fixtures;
            return changeYesterday.concat(todayAndTomorrow);
        })
            .map(function (fixtures) {
            return createIdToFixtureMap(fixtures);
        })
            .flatMap(function (idToFixtureMap) {
            return common_1.fixtureRepo.getByApiIds(Object.keys(idToFixtureMap))
                .map(function (dbFixtures) {
                return {
                    dbFixtures: dbFixtures,
                    idToFixtureMap: idToFixtureMap
                };
            });
        })
            .subscribe(function (map) {
            var changedApiFixtures = [];
            var dbFixtures = map.dbFixtures, idToFixtureMap = map.idToFixtureMap;
            for (var _i = 0, dbFixtures_1 = dbFixtures; _i < dbFixtures_1.length; _i++) {
                var dbFixture = dbFixtures_1[_i];
                var dbFixtureApiId = _.get(dbFixture, apiDetailIdKey, '');
                var apiFixture = idToFixtureMap[dbFixtureApiId];
                if (fixtureChanged(apiFixture, dbFixture)) {
                    apiFixture._id = dbFixture._id;
                    changedApiFixtures.push(apiFixture);
                }
            }
            async_1.setImmediate(function () {
                apiFixture_dbupdate_1.apiFixtureDbUpdateHandler.handle(changedApiFixtures)
                    .subscribe(function (fixture) {
                    console.log("the game : " + getFixtureName(fixture) + " has been updated");
                }, function (err) { console.log("Oops... " + err); }, function () {
                    var fixtureList = dbFixtures.concat(changedApiFixtures);
                    var nextUpdate = calculateNextFixtureUpdateTime(fixtureList);
                    callback(nextUpdate, function () {
                        var finishedFixtures = _.filter(changedApiFixtures, function (f) {
                            var fStatus = f.status.trim().toUpperCase();
                            return fStatus === 'CANCELED' || fStatus === 'POSTPONED' || fStatus === 'FINISHED';
                        });
                        finishedFixture_dbupdate_1.finishedFixtureDbUpdateHandler.handle(finishedFixtures);
                    });
                });
            });
        }, function (err) { console.log("Oops2... " + err); });
    };
    return FixturesUpdater;
}());
exports.fixturesUpdater = new FixturesUpdater();
var getFixtureName = function (fixture) {
    return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
};
//# sourceMappingURL=fixtures-updater.js.map