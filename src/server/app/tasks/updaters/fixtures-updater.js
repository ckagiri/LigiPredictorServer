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
        Rx.Observable.fromPromise(common_1.client.getFixtures())
            .subscribe(function (changedFixtures) {
            fixture_dbupdate_1.fixtureDbUpdateHandler.handle(changedFixtures);
            callback(Moment().add(5, 'minutes'));
        });
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
    };
    return FixturesUpdater;
}());
exports.fixturesUpdater = new FixturesUpdater();
//# sourceMappingURL=fixtures-updater.js.map