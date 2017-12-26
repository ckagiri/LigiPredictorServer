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
var teamRepo = new repositories_1.TeamRepo(new ligi_predictor_1.TeamConverter());
var fixtureRepo = new repositories_1.FixtureRepo(new ligi_predictor_1.FixtureConverter(seasonRepo, repositories_1.TeamRepo));
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
    LeaderboardController.prototype.currentDefaults = function (req, res) {
        var defaultSeason = null;
        var source = seasonRepo.getDefault();
        source
            .flatMap(function (season) {
            defaultSeason = season;
            return fixtureRepo.findAllBySeason(season._id);
        })
            .flatMap(function (fixtures) {
            return Rx.Observable.from(fixtures);
        })
            .reduce(function (acc, fixture) {
            var bestDiff = acc.bestDiff, bestDate = acc.bestDate, closestFixture = acc.closestFixture;
            if (bestDiff == null) {
                bestDiff = -(new Date(0, 0, 0)).valueOf();
                bestDate = fixture.date;
            }
            var now = Date.now();
            var currDiff = Math.abs(fixture.date - now);
            if (currDiff < bestDiff && fixture.status == 'FINISHED') {
                bestDiff = currDiff;
                bestDate = fixture.date;
                closestFixture = fixture;
            }
            acc = { bestDiff: bestDiff, bestDate: bestDate, closestFixture: closestFixture };
            return acc;
        }, {})
            .subscribe(function (map) {
            var closestFixture = map.closestFixture;
            var id = defaultSeason._id, name = defaultSeason.name, slug = defaultSeason.slug, sYear = defaultSeason.year, league = defaultSeason.league;
            var season = { id: id, name: name, slug: slug, sYear: sYear };
            var round = closestFixture.round;
            var date = closestFixture.date;
            var month = date.getUTCMonth() + 1;
            var year = date.getFullYear();
            var data = {
                league: league, season: season, round: round, month: month, year: year
            };
            res.status(200).json(data);
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
    score.change = score.posOld - score.posNew;
    return score;
}
//# sourceMappingURL=leaderboard.controller.js.map