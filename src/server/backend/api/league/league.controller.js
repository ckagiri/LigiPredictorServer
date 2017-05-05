"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repo_league_1 = require("../../../db/repositories/repo.league");
var converter_league_1 = require("../../../db/converters/ligi-predictor/converter.league");
var leagueRepo = new repo_league_1.LeagueRepo(new converter_league_1.LeagueConverter());
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
        var slug = req.params.leagueId;
        leagueRepo.findOne({ slug: slug })
            .flatMap(function (league) {
            return league;
        })
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
//# sourceMappingURL=league.controller.js.map