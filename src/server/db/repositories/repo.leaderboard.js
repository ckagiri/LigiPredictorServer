"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var leaderboard_model_1 = require("../models/leaderboard.model");
var LeaderboardRepo = (function () {
    function LeaderboardRepo() {
    }
    LeaderboardRepo.prototype.updateStatus = function (query, update) {
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
    LeaderboardRepo.prototype.findOneBySeasonAndUpdateStatus = function (seasonId, status) {
        var query = { season: seasonId };
        var update = { season: seasonId, status: status };
        return this.updateStatus(query, update);
    };
    LeaderboardRepo.prototype.findByIdAndUpdateStatus = function (leaderboardId, status) {
        var query = { _id: leaderboardId };
        var update = { status: status };
        return this.updateStatus(query, update);
    };
    return LeaderboardRepo;
}());
exports.LeaderboardRepo = LeaderboardRepo;
//# sourceMappingURL=repo.leaderboard.js.map