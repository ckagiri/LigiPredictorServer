"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var Rx = require("rxjs");
var getFixtureName = function (fixture) {
    return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
};
var UnfinishedFixtureDbUpdateHandler = (function () {
    function UnfinishedFixtureDbUpdateHandler() {
    }
    UnfinishedFixtureDbUpdateHandler.prototype.handle = function (unfinishedFixtures) {
        console.log("Unfinished fixture db update handler");
        Rx.Observable.from(unfinishedFixtures)
            .flatMap(function (fixture) {
            return Rx.Observable.of(fixture);
        })
            .flatMap(function (fixture) {
            return common_1.fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status);
        })
            .subscribe(function (fixture) {
            console.log("the game : " + getFixtureName(fixture) + " has been updated");
        }, function (err) { console.log("Oops... " + err); }, function () {
        });
    };
    return UnfinishedFixtureDbUpdateHandler;
}());
exports.unfinishedFixtureDbUpdateHandler = new UnfinishedFixtureDbUpdateHandler();
//# sourceMappingURL=unfinishedFixture-dbupdate.js.map