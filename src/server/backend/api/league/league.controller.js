"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var Rx = require("rxjs");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
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
            return seasonRepo.findAll();
        })
            .subscribe(function (seasons) {
            res.status(200).json(seasons);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    LeagueController.prototype.showSeason = function (req, res) {
        var leagueId = req.params.leagueId;
        singleLeague(leagueId)
            .subscribe(function (league) {
            return res.sendStatus(404);
        }, function (err) {
            if (err) {
                return res.status(500).json(err);
            }
        });
        var seasonId = req.params.leagueId;
        singleSeason(seasonId)
            .subscribe(function (league) {
            res.status(200).json(league);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return LeagueController;
}());
exports.LeagueController = LeagueController;
function singleLeague(id) {
    return findOne(id, leagueRepo);
}
function singleSeason(id) {
    return findOne(id, seasonRepo);
}
function findOne(id, repo) {
    var one;
    if (isMongoId_1.default(id)) {
        one = repo.findOne({ _id: id });
    }
    else {
        one = repo.findOne({ slug: id });
    }
    return one;
}
//# sourceMappingURL=league.controller.js.map