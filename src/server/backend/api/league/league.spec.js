"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
var chai = require("chai");
var request = require("supertest");
var server_1 = require("../../server");
var league_model_1 = require("./league.model");
var mongoose = require("mongoose");
var Promise = require('bluebird');
chai.should();
mongoose.Promise = Promise;
var clearAllLeagues = function (done) {
    league_model_1.League.remove({}).exec().then(function () {
        done();
    });
};
var newLeague = { name: 'English Premier League' };
var addLeague = function (league) {
    return new Promise(function (resolve) {
        request(server_1.server)
            .post('/api/leagues')
            .send(league)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err) {
            if (err) {
                throw err.message;
            }
            resolve();
        });
    });
};
describe('League API', function () {
    before(function (done) { return clearAllLeagues(done); });
    afterEach(function (done) { return clearAllLeagues(done); });
    it('should add new league to the database', function (done) {
        addLeague(newLeague).then(function (checkDatabase) {
            league_model_1.League.find({}, function (err, leagues) {
                if (err) {
                    return done(err);
                }
                leagues.should.have.length(1);
                done();
            });
        });
    });
});
//# sourceMappingURL=league.spec.js.map