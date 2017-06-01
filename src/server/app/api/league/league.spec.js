"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
var chai = require("chai");
var request = require("supertest");
var server_1 = require("../../server");
var league_model_1 = require("../../../db/models/league.model");
var mongoose = require("mongoose");
var Promise = require('bluebird');
chai.should();
mongoose.Promise = Promise;
var clearAllLeagues = function (done) {
    league_model_1.League.remove({}).exec().then(function () {
        done();
    });
};
var newLeague = { name: 'English Premier League', slug: "english_premier_league" };
var getLeagues = function () {
    return new Promise(function (resolve) {
        request(server_1.server)
            .get('/api/leagues')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err) {
            if (err) {
                throw err;
            }
            resolve();
        });
    });
};
describe('League API', function () {
    before(function (done) { return clearAllLeagues(done); });
    afterEach(function (done) { return clearAllLeagues(done); });
    it('should add new league to the database', function (done) {
        getLeagues().then(function (leagues) {
            console.log(leagues);
        });
    });
});
//# sourceMappingURL=league.spec.js.map