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
var season_model_1 = require("../models/season.model");
var Rx = require("rxjs");
var SeasonRepo = (function (_super) {
    __extends(SeasonRepo, _super);
    function SeasonRepo(converter) {
        return _super.call(this, season_model_1.Season, converter) || this;
    }
    SeasonRepo.prototype.findAllByLeague = function (leagueId) {
        return this.findAll({ 'league.id': leagueId });
    };
    SeasonRepo.prototype.getTeams = function (seasonId) {
        var _this = this;
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            _this.model.findOne({ _id: seasonId })
                .populate('teams')
                .lean()
                .exec(function (err, season) {
                if (err)
                    reject(err);
                if (!season)
                    reject(new Error('Failed to load Season ' + seasonId));
                return resolve(season.teams);
            });
        }));
    };
    SeasonRepo.prototype.getDefault = function () {
        var _this = this;
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            _this.model.findOne({ 'league.slug': 'premier-league', year: '2017' })
                .lean()
                .exec(function (err, season) {
                if (err)
                    reject(err);
                if (!season)
                    reject(new Error('Failed to load Default Season'));
                return resolve(season);
            });
        }));
    };
    SeasonRepo.prototype.updateCurrentRound = function (seasonId, round) {
        return this.update({ _id: seasonId }, { $set: { currentRound: round } });
    };
    SeasonRepo.prototype.getByIds = function (ids) {
        return this.findAll({ _id: { $in: ids } });
    };
    SeasonRepo.prototype.getByApiIds = function (apiIds) {
        var apiDetailIdKey = this.apiDetailIdKey();
        return this.findAll((_a = {}, _a[apiDetailIdKey] = { $in: apiIds }, _a));
        var _a;
    };
    return SeasonRepo;
}(repo_abstract_1.AbstractRepo));
exports.SeasonRepo = SeasonRepo;
//# sourceMappingURL=repo.season.js.map