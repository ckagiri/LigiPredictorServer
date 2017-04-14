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
var manu = {
    name: "Manchester United FC",
    shortName: "Man United",
    code: "MUN",
    slug: "man_united",
    aliases: ["Manchester United", "ManU", "ManUtd"]
};
var manu2 = {
    id: 66,
    name: "Manchester United",
    slug: "man_united",
    crestUrl: "http:manu.jpeg"
};
describe('team repo', function () {
    before(function (done) {
        db.init(environment_1.config.mongo.uri, done, { drop: true });
    });
    afterEach(function (done) {
        db.drop();
        done();
    });
    after(function (done) {
        db.close();
        done();
    });
    xit('insert', function (done) {
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            return Rx.Observable.fromPromise(index_1.ligiTeamRepo.findOne({ _id: team._id }));
        })
            .subscribe(function (res) {
            expect(res.name).to.be.equal(manu.name);
            done();
        }, utils.errorHandler);
    });
    xit('find one by name', function (done) {
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            return index_1.teamRepo.findOneByNameAndUpdate(utils.pmTeams[0]);
        })
            .subscribe(function (res) {
            expect(res.name).to.be.equal(manu.name);
            done();
        }, utils.errorHandler);
    });
    xit('find by name', function (done) {
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            var ateam = utils.pmTeams[0];
            return index_1.teamRepo.findByNameAndUpdate([ateam]);
        })
            .subscribe(function (res) {
            expect(res[0].name).to.be.equal(manu.name);
            done();
        }, utils.errorHandler);
    });
    it('find by slug and update', function (done) {
        var id;
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            var ateam = utils.pmTeams[0];
            id = team._id;
            return index_1.ligiTeamRepo.findOneBySlugAndUpdate(manu2);
        })
            .subscribe(function (res) {
            expect(res.name).to.be.equal(manu2.name);
            done();
        }, utils.errorHandler);
    });
    it('find by apidetail and update', function (done) {
        var id, crestUrl = 'http: manchester.jpeg';
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            var ateam = utils.pmTeams[0];
            id = team._id;
            return index_1.ligiTeamRepo.findBySlugAndUpdate([manu2]);
        })
            .flatMap(function (teams) {
            return index_1.teamRepo.findOneByNameAndUpdate(manu2);
        })
            .flatMap(function (team) {
            return index_1.teamRepo.findByApiIdAndUpdate(manu2.id, { crestUrl: crestUrl });
        })
            .subscribe(function (res) {
            expect(res.crestUrl).to.be.equal(crestUrl);
            done();
        }, utils.errorHandler);
    });
    xit('id mapping', function (done) {
        var expected;
        index_1.ligiTeamRepo.insert(manu)
            .flatMap(function (team) {
            expected = team;
            return index_1.ligiTeamRepo.idMapping(team.api_detail[index_1.ligiTeamRepo.provider].id);
        })
            .subscribe(function (actual) {
            expect(expected._id.toString()).to.be.equal(actual._id.toString());
        }, utils.errorHandler, done);
    });
});
//# sourceMappingURL=team.repo.test.js.map