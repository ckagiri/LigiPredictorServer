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
        var boardType = 'GLOBAL_MONTH';
        options.boardType = boardType;
        var query = { season: season, round: round, boardType: boardType };
        return this.findOneAndUpdate(query, options);
    };
    LeaderboardRepo.prototype.findByIdAndUpdateStatus = function (leaderboardId, status) {
        var query = { _id: leaderboardId };
        var update = { status: status };
        return this.findOneAndUpdate(query, update);
    };
    return LeaderboardRepo;
}());
exports.LeaderboardRepo = LeaderboardRepo;
//# sourceMappingURL=repo.leaderboard.js.map