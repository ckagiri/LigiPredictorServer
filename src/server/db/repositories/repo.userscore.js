"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var user_score_model_1 = require("../models/user-score.model");
var UserScoreRepo = (function () {
    function UserScoreRepo() {
    }
    UserScoreRepo.prototype.createOrfindOneAndUpdate = function (leaderboardId, userId, predictionId, predictionScore, hasJoker) {
        var points = predictionScore.points, goalDiff = predictionScore.goalDiff, score = {
            leaderboard: leaderboardId,
            user: userId,
            points: points,
            goalDiff: goalDiff,
            predictions: ['']
        };
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            user_score_model_1.UserScore.findOne({ leaderboard: leaderboardId, user: userId }, function (err, standing) {
                if (standing == null) {
                    score.predictions = [predictionId];
                    score.pointsExcJoker = points;
                    score.goalDiffExcJoker = goalDiff;
                    user_score_model_1.UserScore.create(score, function (err, result) {
                        if (err)
                            return reject(err);
                        return resolve(result);
                    });
                }
                else {
                    var predExists_1 = false;
                    standing.predictions.forEach(function (predId) {
                        if (predId.toString() == predictionId) {
                            predExists_1 = true;
                        }
                    });
                    if (predExists_1) {
                        return resolve(standing);
                    }
                    standing.points += score.points;
                    standing.pointsExcJoker += score.points;
                    standing.goalDiff += score.goalDiff;
                    standing.goalDiffExcJoker += score.goalDiff;
                    if (hasJoker && score.points > 0 && score.goalDiff > 0) {
                        standing.points += score.points;
                        standing.goalDiff += score.goalDiff;
                    }
                    user_score_model_1.UserScore.findByIdAndUpdate({ _id: standing._id }, {
                        $set: {
                            points: standing.points,
                            goalDiff: standing.goalDiff,
                            pointsExcJoker: standing.pointsExcJoker,
                            goalDiffExcJoker: standing.goalDiffExcJoker
                        },
                        $push: { predictions: predictionId }
                    }, function (err, result) {
                        if (err)
                            return reject(err);
                        return resolve(result);
                    });
                }
            });
        }));
    };
    UserScoreRepo.prototype.getByLeaderboardOrderByPoints = function (leaderboardId) {
        return Rx.Observable.fromPromise(user_score_model_1.UserScore.find({ leaderboard: leaderboardId }, null, { sort: { points: -1, goalDiff: -1 } }));
    };
    UserScoreRepo.prototype.update = function (scoreId, positions) {
        return Rx.Observable.fromPromise(user_score_model_1.UserScore.findByIdAndUpdate({ _id: scoreId }, { $set: positions }));
    };
    return UserScoreRepo;
}());
exports.UserScoreRepo = UserScoreRepo;
//# sourceMappingURL=repo.userscore.js.map