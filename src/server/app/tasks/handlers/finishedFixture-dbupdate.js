"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var finishedFixture_publish_1 = require("./finishedFixture-publish");
var Rx = require("rxjs");
var _ = require("lodash");
var getFixtureName = function (fixture) {
    return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
};
var FinishedFixtureDbUpdateHandler = (function () {
    function FinishedFixtureDbUpdateHandler() {
    }
    FinishedFixtureDbUpdateHandler.prototype.handle = function (finishedFixtures) {
        var leaderboardObsCache = {};
        var roundFixturesObsCache = {};
        var boardIds = [];
        console.log("Finished fixture db update handler");
        Rx.Observable.from(finishedFixtures)
            .flatMap(function (fixture) {
            return Rx.Observable.of(fixture);
        })
            .flatMap(function (fixture) {
            return common_1.fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status);
        })
            .do(function (fixture) {
            console.log("the game : " + getFixtureName(fixture) + " has been updated");
        })
            .flatMap(function (fixture) {
            var season = fixture.season, round = fixture.round;
            var roundFixturesKey = season + "-" + round;
            var roundFixturesObs = roundFixturesObsCache[roundFixturesKey];
            if (roundFixturesObs == null) {
                roundFixturesObs = common_1.fixtureRepo.findAllBySeasonRound(season, round);
                roundFixturesObsCache[roundFixturesKey] = roundFixturesObs;
            }
            return roundFixturesObs.map(function (fixtures) {
                var roundFixtureIds = _.map(fixtures, function (val) { return val._id.toString(); });
                return { fixture: fixture, roundFixtureIds: roundFixtureIds };
            });
        })
            .flatMap(function (map) {
            var fixture = map.fixture, roundFixtureIds = map.roundFixtureIds;
            return finishedFixture_publish_1.finishedFixturePublishHandler.handle(fixture, roundFixtureIds);
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            return common_1.predictionRepo.update(prediction)
                .map(function (status) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var season = fixture.season, round = fixture.round;
            var seasonBoardKey = season;
            var seasonBoardObs = leaderboardObsCache[seasonBoardKey];
            if (seasonBoardObs == null) {
                seasonBoardObs = common_1.leaderboardRepo.findOneBySeasonAndUpdate({ season: season, status: "UpdatingScores" });
                leaderboardObsCache[seasonBoardKey] = seasonBoardObs;
            }
            var roundBoardKey = season + "-" + round;
            var roundBoardObs = leaderboardObsCache[roundBoardKey];
            if (roundBoardObs == null) {
                roundBoardObs = common_1.leaderboardRepo.findOneByRoundAndUpdate({ season: season, round: round, status: "UpdatingScores" });
                leaderboardObsCache[roundBoardKey] = roundBoardObs;
            }
            return Rx.Observable.forkJoin(seasonBoardObs, roundBoardObs)
                .flatMap(function (leaderboards) {
                return Rx.Observable.from(leaderboards);
            })
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
            var points = prediction.points, goalDiff = prediction.goalDiff, hasJoker = prediction.hasJoker;
            var predictionScore = {
                scorePoints: scorePoints, points: points, goalDiff: goalDiff
            };
            return common_1.userScoreRepo.createOrfindOneAndUpdate(leaderboardId, userId, predictionId, predictionScore, hasJoker)
                .map(function (status) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .subscribe(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var choiceGoalsHomeTeam = prediction.choice.goalsHomeTeam;
            var choiceGoalsAwayTeam = prediction.choice.goalsAwayTeam;
            console.log(user.displayName + ", " + getFixtureName(fixture) + ", " + choiceGoalsHomeTeam + " " + choiceGoalsAwayTeam);
        }, function (err) { console.log("Oops... " + err); }, function () {
            // AllPredictionsProcessed
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
    return FinishedFixtureDbUpdateHandler;
}());
exports.finishedFixtureDbUpdateHandler = new FinishedFixtureDbUpdateHandler();
//# sourceMappingURL=finishedFixture-dbupdate.js.map