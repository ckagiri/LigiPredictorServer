"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
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
describe('seasonRepo repo', function () {
    before(function (done) {
        db.init(environment_1.config.mongo.uri, done, { drop: false });
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
        index_1.ligiLeagueRepo.insert(epl)
            .flatMap(function (league) {
            epl16.leagueId = league._id;
            return index_1.ligiSeasonRepo.insert(epl16);
        })
            .subscribe(function (res) {
            console.log(res);
            done();
        }, utils.errorHandler);
    });
});
//# sourceMappingURL=season.repo.test.js.map