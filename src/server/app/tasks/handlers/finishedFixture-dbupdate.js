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
    FinishedFixtureDbUpdateHandler.prototype.handle = function (finishedFixtures, fromDb) {
        var leaderboardObsCache = {};
        var roundFixturesObsCache = {};
        var boardIds = [];
        console.log("Finished fixture db update handler");
        Rx.Observable.from(finishedFixtures)
            .flatMap(function (fixture) {
            if (fixture.status === 'FINISHED' && fixture.allPredictionsProcessed === false) {
                return Rx.Observable.of(fixture);
            }
            return common_1.fixtureRepo.updateFixtureById(fixture._id, fixture.result, fixture.status);
        })
            .do(function (fixture) {
            if (!fromDb) {
                console.log("the game : " + getFixtureName(fixture) + " has been updated");
            }
        })
            .flatMap(function (fixture) {
            var season = fixture.season, round = fixture.round;
            var roundFixturesKey = season + "-" + round;
            var roundFixturesObs = roundFixturesObsCache[roundFixturesKey];
            if (roundFixturesObs == null) {
                roundFixturesObs = common_1.fixtureRepo.findAvailableBySeasonRound(season, round);
                roundFixturesObsCache[roundFixturesKey] = roundFixturesObs;
            }
            return roundFixturesObs.map(function (fixtures) {
                var roundFixtureIds = _.map(fixtures, function (val) { return val._id.toString(); });
                roundFixtureIds.push(fixture._id.toString());
                return { fixture: fixture, roundFixtureIds: roundFixtureIds };
            });
        })
            .concatMap(function (map) {
            var fixture = map.fixture, roundFixtureIds = map.roundFixtureIds;
            return finishedFixture_publish_1.finishedFixturePublishHandler.handle(fixture, roundFixtureIds);
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            if (prediction.status === 'ALREADY_PROCESSED') {
                return Rx.Observable.of({ user: user, fixture: fixture, prediction: prediction });
            }
            return common_1.predictionRepo.update(prediction)
                .map(function (_) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var season = fixture.season, round = fixture.round;
            var month = fixture.date.getUTCMonth() + 1;
            var year = fixture.date.getFullYear();
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
            var monthBoardKey = season + "-" + year + "-" + month;
            var monthBoardObs = leaderboardObsCache[monthBoardKey];
            if (monthBoardObs == null) {
                monthBoardObs = common_1.leaderboardRepo.findOneByMonthAndUpdate({ season: season, round: round, year: year, month: month, status: "UpdatingScores" });
                leaderboardObsCache[monthBoardKey] = monthBoardObs;
            }
            return Rx.Observable.forkJoin(seasonBoardObs, roundBoardObs, monthBoardObs)
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
            var fixtureId = fixture._id;
            var predictionId = prediction._id;
            var scorePoints = prediction.scorePoints.toObject();
            var points = prediction.points, goalDiff = prediction.goalDiff, hasJoker = prediction.hasJoker;
            var predictionScore = {
                scorePoints: scorePoints, points: points, goalDiff: goalDiff
            };
            return common_1.userScoreRepo.findOneAndUpdateOrCreate(leaderboardId, userId, fixtureId, predictionId, predictionScore, hasJoker)
                .map(function (status) {
                return { user: user, fixture: fixture, prediction: prediction };
            });
        })
            .subscribe(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var choiceGoalsHomeTeam = prediction.choice.goalsHomeTeam;
            var choiceGoalsAwayTeam = prediction.choice.goalsAwayTeam;
            //console.log(`${user.displayName}, ${getFixtureName(fixture)}, ${choiceGoalsHomeTeam} ${choiceGoalsAwayTeam}`)
        }, function (err) { console.log("Oops... " + err); }, function () {
            Rx.Observable.from(boardIds)
                .flatMap(function (leaderboardId) {
                return common_1.leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "UpdatingRankings");
            })
                .flatMap(function (leaderboard) {
                var leaderboardId = leaderboard._id;
                return common_1.userScoreRepo.getByLeaderboardOrderByPoints(leaderboardId)
                    .flatMap(function (scores) {
                    return Rx.Observable.from(scores);
                })
                    .flatMap(function (score, index) {
                    index += 1;
                    var previousPosition = score.posNew || 0;
                    if (previousPosition === index) {
                        return Rx.Observable.of(leaderboardId.toString());
                    }
                    var posOld = previousPosition;
                    var posNew = index;
                    return common_1.userScoreRepo.update(score._id, { posOld: posOld, posNew: posNew })
                        .map(function (_) {
                        return leaderboardId.toString();
                    });
                });
            })
                .distinct()
                .toArray()
                .flatMap(function (leaderboardIds) {
                return Rx.Observable.from(leaderboardIds);
            })
                .subscribe(function (leaderboardId) {
                common_1.leaderboardRepo.findByIdAndUpdateStatus(leaderboardId, "Refreshed");
            }, function (err) { }, function () {
                console.log('rankings updated');
                Rx.Observable.from(finishedFixtures)
                    .flatMap(function (fixture) {
                    return common_1.fixtureRepo.allPredictionsProcessed(fixture._id);
                }).subscribe(function (fixture) {
                    console.log(fixture.slug + " all predictions processed");
                }, function (err) { }, function () {
                    console.log('all fixture predictions processed');
                });
            });
        });
    };
    return FinishedFixtureDbUpdateHandler;
}());
exports.finishedFixtureDbUpdateHandler = new FinishedFixtureDbUpdateHandler();
//# sourceMappingURL=finishedFixture-dbupdate.js.map