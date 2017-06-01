"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var Rx = require("rxjs");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var teamRepo = new repositories_1.TeamRepo(new ligi_predictor_1.TeamConverter());
var fixtureRepo = new repositories_1.FixtureRepo(new ligi_predictor_1.FixtureConverter(seasonRepo, repositories_1.TeamRepo));
var LeagueController = (function () {
    function LeagueController() {
    }
    LeagueController.prototype.list = function (req, res) {
        leagueRepo.findAll()
            .subscribe(function (leagues) {
            res.status(200).json(leagues);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.show = function (req, res) {
        var id = req.params.id;
        singleLeague(id)
            .subscribe(function (league) {
            res.status(200).json(league);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.listSeasons = function (req, res) {
        var leagueId = req.params.leagueId;
        singleLeague(leagueId)
            .flatMap(function (league) {
            if (!league) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(league);
        })
            .flatMap(function (league) {
            return seasonRepo.findAllByLeague(league._id);
        })
            .subscribe(function (seasons) {
            res.status(200).json(seasons);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.showSeason = function (req, res) {
        var _a = req.params, leagueId = _a.leagueId, seasonId = _a.seasonId;
        singleLeague(leagueId)
            .flatMap(function (league) {
            if (!league) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(league);
        })
            .flatMap(function (league) {
            return singleSeason(leagueId, seasonId);
        })
            .subscribe(function (season) {
            res.status(200).json(season);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.listTeams = function (req, res) {
        var _a = req.params, leagueId = _a.leagueId, seasonId = _a.seasonId;
        singleSeason(leagueId, seasonId)
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return seasonRepo.getTeams(season._id);
        })
            .subscribe(function (teams) {
            res.status(200).json(teams);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.listRounds = function (req, res) {
        var _a = req.params, leagueId = _a.leagueId, seasonId = _a.seasonId;
        singleSeason(leagueId, seasonId)
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return Rx.Observable.range(1, season.numberOfRounds || 38);
        })
            .map(function (rNum) {
            return {
                name: "Round " + rNum,
                slug: "round-" + rNum,
            };
        })
            .toArray()
            .subscribe(function (seasons) {
            res.status(200).json(seasons);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.showRound = function (req, res) {
        var _a = req.params, leagueId = _a.leagueId, seasonId = _a.seasonId, roundId = _a.roundId;
        singleSeason(leagueId, seasonId)
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .map(function (season) {
            return { round: roundId }; // Todo:fetch single-round
        })
            .subscribe(function (round) {
            res.status(200).json(round);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.listFixtures = function (req, res) {
        var _a = req.params, leagueId = _a.leagueId, seasonId = _a.seasonId, roundId = _a.roundId;
        leagueId = leagueId || req.query.league;
        seasonId = seasonId || req.query.league;
        roundId = roundId || req.query.league;
        singleSeason(leagueId, seasonId)
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            if (roundId) {
                roundId = roundId.split('-').pop();
                return fixtureRepo.findAllBySeasonRound(season._id, roundId);
            }
            return fixtureRepo.findAllBySeason(season._id);
        })
            .subscribe(function (fixtures) {
            res.status(200).json(fixtures);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return LeagueController;
}());
exports.LeagueController = LeagueController;
function singleLeague(id) {
    var league;
    if (isMongoId_1.default(id)) {
        league = leagueRepo.findOne({ _id: id });
    }
    else {
        league = leagueRepo.findOne({ slug: id });
    }
    return league;
}
function singleSeason(leagueId, seasonId) {
    var query;
    query = { $and: [{ 'league.slug': leagueId }, { slug: seasonId }] };
    var season = seasonRepo.findOne(query);
    return season;
}
//# sourceMappingURL=league.controller.js.map