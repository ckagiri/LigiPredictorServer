"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var repo_abstract_1 = require("./repo.abstract");
var fixture_model_1 = require("../models/fixture.model");
var Rx = require("rxjs");
var FixtureRepo = (function (_super) {
    __extends(FixtureRepo, _super);
    function FixtureRepo(converter) {
        return _super.call(this, fixture_model_1.Fixture, converter) || this;
    }
    FixtureRepo.prototype.findAllBySeason = function (seasonId) {
        return this.findAll({ season: seasonId });
    };
    FixtureRepo.prototype.findAllBySeasonRound = function (seasonId, round) {
        var query = { $and: [{ season: seasonId }, { round: round }] };
        return this.findAll(query, null, { sort: 'date' });
    };
    FixtureRepo.prototype.findAvailableBySeasonRound = function (seasonId, round) {
        var query = { $or: [
                { $and: [
                        { season: seasonId }, { round: round },
                        { status: { $in: ['SCHEDULED', 'TIMED', 'IN_PLAY'] } }
                    ] },
                { $and: [
                        { season: seasonId }, { round: round },
                        { status: { $in: ['CANCELED', 'POSTPONED', 'FINISHED'] } },
                        { allPredictionsProcessed: false }
                    ] }
            ] };
        return this.findAll(query, null, { sort: 'date' });
    };
    FixtureRepo.prototype.getByApiIds = function (apiIds) {
        var apiDetailIdKey = this.apiDetailIdKey();
        var query = (_a = {}, _a[apiDetailIdKey] = { $in: apiIds }, _a);
        return this.findAll(query);
        var _a;
    };
    FixtureRepo.prototype.findById = function (fixtureId) {
        return this.findOne({ _id: fixtureId });
    };
    FixtureRepo.prototype.updateFixtureById = function (fixtureId, result, status, odds) {
        var update = {
            result: result,
            status: status,
            odds: odds
        };
        Object.keys(update).forEach(function (key) { return (update[key] == null) && delete update[key]; });
        return this.updateById({ _id: fixtureId }, { $set: update });
    };
    FixtureRepo.prototype.findFixtureAndUpdate = function (query, update) {
        var options = { upsert: true, new: true };
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            fixture_model_1.Fixture.findOneAndUpdate(query, update, { new: true, upsert: true }, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        }));
    };
    FixtureRepo.prototype.allPredictionsProcessed = function (fixtureId) {
        return this.findFixtureAndUpdate({ _id: fixtureId }, { allPredictionsProcessed: true });
    };
    return FixtureRepo;
}(repo_abstract_1.AbstractRepo));
exports.FixtureRepo = FixtureRepo;
//# sourceMappingURL=repo.fixture.js.map