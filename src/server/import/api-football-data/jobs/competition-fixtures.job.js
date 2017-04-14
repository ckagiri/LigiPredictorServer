"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var _ = require("lodash");
var main_job_1 = require("./main.job");
var index_1 = require("../index");
var CompetitionFixturesJob = (function () {
    function CompetitionFixturesJob(comp) {
        this.comp = comp;
        this.fixturesRepo = index_1.fixtureRepo;
        this.seasonRepo = index_1.seasonRepo;
        this.teamRepo = index_1.teamRepo;
    }
    CompetitionFixturesJob.prototype.start = function () {
        var _this = this;
        console.log("Competition fixtures job" + JSON.stringify(this.comp));
        var apiDetailIdKey = index_1.teamRepo.apiDetailIdKey();
        var competitionApiId = _.get(this.comp, apiDetailIdKey);
        Rx.Observable.fromPromise(main_job_1.client.getCompetitionById(competitionApiId).getFixtures())
            .map(function (res) {
            var fixtures = res.data.fixtures;
            for (var _i = 0, fixtures_1 = fixtures; _i < fixtures_1.length; _i++) {
                var fixture = fixtures_1[_i];
                fixture.seasonId = competitionApiId;
            }
            return fixtures;
        })
            .flatMap(function (fixtures) {
            return index_1.fixtureRepo.findBySlugAndUpdate(fixtures);
        })
            .subscribe(function () {
        }, function (err) {
            console.error(err);
        }, function () {
            console.log("Saved fixtures for : " + _this.comp.caption);
        });
    };
    return CompetitionFixturesJob;
}());
exports.CompetitionFixturesJob = CompetitionFixturesJob;
//# sourceMappingURL=competition-fixtures.job.js.map