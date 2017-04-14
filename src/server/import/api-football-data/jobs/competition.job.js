"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var main_job_1 = require("./main.job");
var index_1 = require("../index");
var competition_fixtures_job_1 = require("./competition-fixtures.job");
var CompetitionJob = (function () {
    function CompetitionJob(comp) {
        this.comp = comp;
        this.teamRepo = index_1.teamRepo;
        this.seasonRepo = index_1.seasonRepo;
    }
    CompetitionJob.prototype.start = function (queue) {
        var _this = this;
        this.queue = queue;
        console.log("Competition job: " + this.comp.caption);
        Rx.Observable.fromPromise(main_job_1.client.getCompetitionById(this.comp.id).getTeams())
            .map(function (res) {
            return res.data.teams;
        })
            .flatMap(function (teams) {
            return _this.teamRepo.findByNameAndUpdate(teams);
        })
            .flatMap(function (teams) {
            return _this.seasonRepo.findByApiIdAndUpdate(_this.comp);
        })
            .subscribe(function (savedComp) {
            var compFixturesJob = new competition_fixtures_job_1.CompetitionFixturesJob(savedComp);
            _this.queue.addJob(compFixturesJob);
            console.log('subscribed');
        }, function (err) {
            console.error(err);
        }, function () {
            console.log("Finished");
        });
    };
    return CompetitionJob;
}());
exports.default = CompetitionJob;
//# sourceMappingURL=competition.job.js.map