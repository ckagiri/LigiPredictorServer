"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var _ = require("lodash");
var common_1 = require("../common");
var finishedFixture_dbupdate_1 = require("../handlers/finishedFixture-dbupdate");
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
    return true;
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
            var changedFixtures = [];
            var dbFixtures = map.dbFixtures, idToFixtureMap = map.idToFixtureMap;
            for (var _i = 0, dbFixtures_1 = dbFixtures; _i < dbFixtures_1.length; _i++) {
                var dbFixture = dbFixtures_1[_i];
                var dbFixtureId = _.get(dbFixture, apiDetailIdKey, '');
                var newFixture = idToFixtureMap[dbFixtureId];
                if (fixtureChanged(newFixture, dbFixture)) {
                    newFixture._id = dbFixture._id;
                    console.log('fixtureChanged');
                    console.log(newFixture);
                    changedFixtures.push(newFixture);
                }
            }
            var finishedFixtures = _.filter(changedFixtures, { status: 'FINISHED' });
            finishedFixture_dbupdate_1.finishedFixtureDbUpdateHandler.handle(finishedFixtures);
            callback(Moment().add(15, 'minutes'));
        });
    };
    return FixturesUpdater;
}());
exports.fixturesUpdater = new FixturesUpdater();
//# sourceMappingURL=fixtures-updater.js.map