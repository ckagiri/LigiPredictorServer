"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var Rx = require("rxjs");
var ApiFixtureDbUpdateHandler = (function () {
    function ApiFixtureDbUpdateHandler() {
    }
    ApiFixtureDbUpdateHandler.prototype.handle = function (unfinishedFixtures) {
        console.log("api-fixture db update handler");
        return Rx.Observable.from(unfinishedFixtures)
            .flatMap(function (fixture) {
            return Rx.Observable.of(fixture);
        })
            .flatMap(function (fixture) {
            return common_1.fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status);
        });
    };
    return ApiFixtureDbUpdateHandler;
}());
exports.apiFixtureDbUpdateHandler = new ApiFixtureDbUpdateHandler();
//# sourceMappingURL=apiFixture-dbupdate.js.map