"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var common_1 = require("../common");
var fixture_dbupdate_1 = require("../handlers/fixture-dbupdate");
var Moment = require('moment');
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
var FixturesUpdater = (function () {
    function FixturesUpdater() {
    }
    FixturesUpdater.prototype.update = function (callback) {
        //Rx.Observable.fromPromise(client.getFixtures(445, null))
        //   .subscribe((changedFixtures: any[]) => {
        //     fixtureDbUpdateHandler.handle(changedFixtures);
        //     callback(Moment().add(5, 'minutes')); 
        // })
        Rx.Observable.zip(Rx.Observable.fromPromise(common_1.client.getFixtures(445, { timeFrame: 'p1' })), Rx.Observable.fromPromise(common_1.client.getFixtures(445, { timeFrame: 'n1' })), function (changeYesterday, todayAndTomorrow) {
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
                console.log('dbFixtures');
                console.log(dbFixtures);
                return {
                    dbFixtures: dbFixtures,
                    idToFixtureMap: idToFixtureMap
                };
            });
        })
            .subscribe(function (map) {
            var changedFixtures = [];
            for (var _i = 0, _a = map.dbFixtures; _i < _a.length; _i++) {
                var dbFixture = _a[_i];
                var newFixture = map.idToFixtureMap[dbFixture.api_detail.id];
                if (fixtureChanged(newFixture, dbFixture)) {
                    newFixture._id = dbFixture._id;
                    console.log('fixtureChanged');
                    console.log(newFixture);
                    changedFixtures.push(newFixture);
                }
            }
            fixture_dbupdate_1.fixtureDbUpdateHandler.handle(changedFixtures);
            callback(Moment().add(15, 'minutes'));
        });
    };
    return FixturesUpdater;
}());
exports.fixturesUpdater = new FixturesUpdater();
//# sourceMappingURL=fixtures-updater.js.map