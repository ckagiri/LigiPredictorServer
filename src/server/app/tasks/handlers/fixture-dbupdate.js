"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var fixture_publish_1 = require("./fixture-publish");
var Rx = require("rxjs");
var getFixtureName = function (fixture) {
    return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
};
var FixtureDbUpdateHandler = (function () {
    function FixtureDbUpdateHandler() {
    }
    FixtureDbUpdateHandler.prototype.handle = function (changedFixtures) {
        var boards = {};
        var boardIds = [];
        console.log("fixture db update handler");
        Rx.Observable.from(changedFixtures)
            .flatMap(function (fixture) {
            return Rx.Observable.of(fixture);
        })
            .flatMap(function (fixture) {
            return common_1.fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status, fixture.odds);
        })
            .do(function (fixture) {
            console.log("the game : " + getFixtureName(fixture) + " has been updated");
        })
            .flatMap(function (fixture) {
            return fixture_publish_1.predictionHandler.handle(fixture);
        })
            .onErrorResumeNext()
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            return common_1.predictionRepo.update(prediction)
                .map(function (status) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            // getCached
            return common_1.leaderboardRepo.findOneBySeasonAndUpdateStatus(fixture.season, "UpdatingScores")
                .map(function (leaderboard) {
                var boardId = leaderboard._id.toString();
                if (boardIds.indexOf(boardId) === -1) {
                    boardIds.push(boardId);
                }
                return { user: user, fixture: fixture, prediction: prediction, leaderboard: leaderboard };
            });
        })
            .concatMap(function (map) {
            var leaderboard = map.leaderboard, user = map.user, fixture = map.fixture, prediction = map.prediction;
            var leaderboardId = leaderboard._id;
            var userId = user._id;
            var predictionId = prediction._id;
            var scorePoints = prediction.scorePoints.toObject();
            var points = prediction.points, goalDiff = prediction.goalDiff;
            var predictionScore = {
                scorePoints: scorePoints, points: points, goalDiff: goalDiff
            };
            return common_1.userScoreRepo.createOrfindOneAndUpdate(leaderboardId, userId, predictionId, predictionScore)
                .map(function (status) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .onErrorResumeNext()
            .subscribe(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var choiceGoalsHomeTeam = prediction.choice.goalsHomeTeam;
            var choiceGoalsAwayTeam = prediction.choice.goalsAwayTeam;
            console.log(user.displayName + ", " + getFixtureName(fixture) + ", " + choiceGoalsHomeTeam + " " + choiceGoalsAwayTeam);
        }, function (err) { console.log("Oops... " + err); }, function () {
            Rx.Observable.from(boardIds)
                .flatMap(function (leaderboardIds) {
                return Rx.Observable.from(boardIds);
            })
                .flatMap(function (leaderboardId) {
                return common_1.leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "UpdatingRankings");
            })
                .do(function (leaderboard) {
                var leaderboardId = leaderboard._id;
                common_1.userScoreRepo.getByLeaderboardOrderByPoints(leaderboardId)
                    .flatMap(function (scores) {
                    return Rx.Observable.from(scores);
                })
                    .flatMap(function (score, index) {
                    index += 1;
                    var previousPosition = score.posNew || 0;
                    var posOld = previousPosition;
                    var posNew = index;
                    return common_1.userScoreRepo.update(score._id, { posOld: posOld, posNew: posNew });
                })
                    .subscribe(function () { }, function (err) { }, function () {
                    common_1.leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "Refreshed");
                });
            })
                .subscribe(function () { }, function (err) { }, function () {
                console.log('rankings updated');
            });
        });
    };
    return FixtureDbUpdateHandler;
}());
exports.fixtureDbUpdateHandler = new FixtureDbUpdateHandler();
//# sourceMappingURL=fixture-dbupdate.js.map