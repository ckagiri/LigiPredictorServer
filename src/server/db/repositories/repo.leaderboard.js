"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var leaderboard_model_1 = require("../models/leaderboard.model");
var LeaderboardRepo = (function () {
    function LeaderboardRepo() {
    }
    LeaderboardRepo.prototype.findOneAndUpdate = function (query, update) {
        var options = { upsert: true, new: true };
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            leaderboard_model_1.Leaderboard.findOneAndUpdate(query, update, { new: true, upsert: true }, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        }));
    };
    LeaderboardRepo.prototype.findOneBySeasonAndUpdate = function (options) {
        var season = options.season;
        var boardType = 'GLOBAL_SEASON';
        options.boardType = boardType;
        var query = { season: season, boardType: boardType };
        return this.findOneAndUpdate(query, options);
    };
    LeaderboardRepo.prototype.findOneByRoundAndUpdate = function (options) {
        var season = options.season, round = options.round;
        var boardType = 'GLOBAL_ROUND';
        options.boardType = boardType;
        var query = { season: season, round: round, boardType: boardType };
        return this.findOneAndUpdate(query, options);
    };
    LeaderboardRepo.prototype.findByIdAndUpdateStatus = function (leaderboardId, status) {
        var query = { _id: leaderboardId };
        var update = { status: status };
        return this.findOneAndUpdate(query, update);
    };
    LeaderboardRepo.prototype.findAll = function (query, projection, options) {
        if (query === void 0) { query = {}; }
        return Rx.Observable.fromPromise(leaderboard_model_1.Leaderboard.find(query, projection, options).lean());
    };
    LeaderboardRepo.prototype.findOne = function (query, projection) {
        return Rx.Observable.fromPromise(leaderboard_model_1.Leaderboard.findOne(query, projection));
    };
    LeaderboardRepo.prototype.findAllBySeason = function (seasonId) {
        return this.findAll({ season: seasonId });
    };
    LeaderboardRepo.prototype.findAllBySeasonRound = function (seasonId, round) {
        var query = { $and: [{ season: seasonId }, { round: round }] };
        return this.findAll(query, null, { sort: 'date' });
    };
    LeaderboardRepo.prototype.findAllBySeasonMonth = function (seasonId, year, month) {
        var query = { $and: [{ season: seasonId }, { year: year }, { month: month }] };
        return this.findAll(query, null, { sort: 'date' });
    };
    return LeaderboardRepo;
}());
exports.LeaderboardRepo = LeaderboardRepo;
//# sourceMappingURL=repo.leaderboard.js.map