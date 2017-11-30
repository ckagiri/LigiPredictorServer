"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var Rx = require("rxjs");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var leaderboardRepo = new repositories_1.LeaderboardRepo();
var userScoreRepo = new repositories_1.UserScoreRepo();
var LeaderboardController = (function () {
    function LeaderboardController() {
    }
    LeaderboardController.prototype.show = function (req, res) {
        var id = req.params.id;
        var source = null;
        if (isMongoId_1.default(id)) {
            source = leaderboardRepo.findOne({ _id: id });
        }
        if (source == null) {
            res.status(500).json("bad request");
        }
        source.subscribe(function (leaderboard) {
            res.status(200).json(leaderboard);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeaderboardController.prototype.seasonList = function (req, res) {
        var _a = req.params, leagueSlug = _a.league, seasonSlug = _a.season;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return leaderboardRepo.findSeasonBoard(season._id);
        })
            .flatMap(function (board) {
            return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id);
        })
            .flatMap(function (userScores) {
            return Rx.Observable.from(userScores);
        })
            .map(function (userScore) {
            return mapScore(userScore);
        })
            .toArray()
            .subscribe(function (userScores) {
            res.status(200).json(userScores);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeaderboardController.prototype.seasonRoundList = function (req, res) {
        var _a = req.params, leagueSlug = _a.league, seasonSlug = _a.season, round = _a.round;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            round = parseInt(round);
            return leaderboardRepo.findRoundBoard(season._id, round || season.currentRound);
        })
            .flatMap(function (board) {
            if (board == null) {
                return Rx.Observable.empty();
            }
            return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id);
        })
            .flatMap(function (userScores) {
            return Rx.Observable.from(userScores);
        })
            .map(function (userScore) {
            return mapScore(userScore);
        })
            .toArray()
            .subscribe(function (userScores) {
            res.status(200).json(userScores);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeaderboardController.prototype.seasonMonthList = function (req, res) {
        var _a = req.params, leagueSlug = _a.league, seasonSlug = _a.season, round = _a.round, year = _a.year, month = _a.month;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return leaderboardRepo.findMonthBoard(season._id, year, month);
        })
            .flatMap(function (board) {
            return userScoreRepo.getOneByLeaderboardOrderByPoints(board._id);
        })
            .flatMap(function (userScores) {
            return Rx.Observable.from(userScores);
        })
            .map(function (userScore) {
            return mapScore(userScore);
        })
            .toArray()
            .subscribe(function (userScores) {
            res.status(200).json(userScores);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return LeaderboardController;
}());
exports.LeaderboardController = LeaderboardController;
function singleSeason(leagueId, seasonId) {
    var query;
    query = { $and: [{ 'league.slug': leagueId }, { slug: seasonId }] };
    var season = seasonRepo.findOne(query);
    return season;
}
function mapScore(userScore) {
    var score = {};
    score.user = userScore.user;
    score.points = userScore.points;
    score.goalDiff = userScore.goalDiff;
    score.rank = userScore.posNew;
    score.posNew = userScore.posNew;
    score.posOld = userScore.posOld;
    score.change = score.posNew - score.posOld;
    return score;
}
//# sourceMappingURL=leaderboard.controller.js.map