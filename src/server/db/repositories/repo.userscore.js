"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var user_score_model_1 = require("../models/user-score.model");
var UserScoreRepo = (function () {
    function UserScoreRepo() {
    }
    UserScoreRepo.prototype.findOneAndUpdateOrCreate = function (leaderboardId, userId, fixtureId, predictionId, predictionScore, hasJoker) {
        var points = predictionScore.points, goalDiff = predictionScore.goalDiff, score = {
            leaderboard: leaderboardId,
            user: userId,
            points: points,
            goalDiff: goalDiff,
            fixtures: [''],
            predictions: ['']
        };
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            user_score_model_1.UserScore.findOne({ leaderboard: leaderboardId, user: userId }, function (err, standing) {
                if (standing == null) {
                    score.fixtures = [fixtureId];
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
                    var fixtureExists_1 = false;
                    standing.fixtures.forEach(function (fixture) {
                        if (fixture.toString() == fixtureId) {
                            fixtureExists_1 = true;
                        }
                    });
                    if (fixtureExists_1) {
                        return resolve(standing);
                    }
                    standing.points += score.points;
                    standing.pointsExcJoker += score.points;
                    standing.goalDiff += score.goalDiff;
                    standing.goalDiffExcJoker += score.goalDiff;
                    if (hasJoker && score.goalDiff >= 0) {
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
                        $push: { fixtures: fixtureId, predictions: predictionId }
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
    UserScoreRepo.prototype.getOneByLeaderboardOrderByPoints = function (leaderboardId) {
        return Rx.Observable.fromPromise(user_score_model_1.UserScore.find({ leaderboard: leaderboardId }, null, { sort: { points: -1, goalDiff: -1 } }).populate('user').lean());
    };
    UserScoreRepo.prototype.update = function (scoreId, positions) {
        return Rx.Observable.fromPromise(user_score_model_1.UserScore.findByIdAndUpdate({ _id: scoreId }, { $set: positions }));
    };
    return UserScoreRepo;
}());
exports.UserScoreRepo = UserScoreRepo;
//# sourceMappingURL=repo.userscore.js.map