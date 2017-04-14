"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
var Rx = require("rxjs");
var mongoose = require("mongoose");
var chai = require("chai");
var environment_1 = require("../../../config/environment");
var db = require("../../index");
var index_1 = require("../../index");
var expect = chai.expect;
var utils = require('./test_utils');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var epl = {
    name: "English Premier League",
    code: "PL",
    slug: "premier-league"
};
var epl16 = {
    name: "2016-2017",
    slug: "16-17",
    year: "2016",
    leagueId: null
};
var leic = {
    name: "Leicester City FC",
    shortName: "Leicester",
    code: "LEI",
    slug: "leicester_city",
    aliases: []
};
var hull = {
    name: "Hull City FC",
    shortName: "Hull",
    code: "HUL",
    slug: "hull_city",
    aliases: []
};
describe('Fixtures Repository test', function () {
    before(function (done) {
        db.init(environment_1.config.mongo.uri, done, { drop: true });
    });
    afterEach(function (done) {
        // db.drop();
        done();
    });
    after(function (done) {
        db.close();
        done();
    });
    xit('insert', function (done) {
        var league, season, team1, team2;
        Rx.Observable.zip(index_1.ligiLeagueRepo.insert(epl), index_1.ligiTeamRepo.insert(hull), index_1.ligiTeamRepo.insert(leic))
            .flatMap(function (arr) {
            league = arr[0];
            team1 = arr[1];
            team2 = arr[2];
            epl16.leagueId = league._id;
            return Rx.Observable.zip(index_1.ligiSeasonRepo.insert(epl16), index_1.teamRepo.findOneByNameAndUpdate(utils.pmTeams[1]), index_1.teamRepo.findOneByNameAndUpdate(utils.pmTeams[2]));
        })
            .flatMap(function (arr) {
            season = arr[0];
            return index_1.seasonRepo.findByIdAndUpdate(season._id, { id: 426,
                caption: "Premier League 2016/17",
                currentMatchday: 4
            });
        })
            .flatMap(function (obj) {
            var fixture = utils.fixtures[0];
            fixture.seasonId = 426;
            return index_1.fixtureRepo.insert(fixture);
        })
            .subscribe(function (fixt) {
            expect(fixt.season.toString()).to.be.equal(season._id.toString());
            expect(fixt.homeTeam.name).to.be.equal(hull.shortName);
            expect(fixt.awayTeam.name).to.be.equal(leic.shortName);
            done();
        }, utils.errorHandler);
    });
});
//# sourceMappingURL=fixture.repo.test.js.map