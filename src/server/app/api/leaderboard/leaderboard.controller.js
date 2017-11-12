"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var Rx = require("rxjs");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var leaderboardRepo = new repositories_1.LeaderboardRepo();
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
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season;
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
            return leaderboardRepo.findAllBySeason(season._id);
        })
            .subscribe(function (leaderboards) {
            res.status(200).json(leaderboards);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeaderboardController.prototype.seasonRoundList = function (req, res) {
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season, round = _a.round;
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
            return leaderboardRepo.findAllBySeasonRound(season._id, round || season.currentRound);
        })
            .subscribe(function (leaderboards) {
            res.status(200).json(leaderboards);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeaderboardController.prototype.seasonMonthList = function (req, res) {
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season, round = _a.round, year = _a.year, month = _a.month;
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
            return leaderboardRepo.findAllBySeasonMonth(season._id, year, month);
        })
            .subscribe(function (leaderboards) {
            res.status(200).json(leaderboards);
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
//# sourceMappingURL=leaderboard.controller.js.map