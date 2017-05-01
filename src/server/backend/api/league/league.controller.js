"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var league_model_1 = require("../../../db/models/league.model");
var LeagueController = (function () {
    function LeagueController() {
    }
    LeagueController.prototype.list = function (req, res) {
        league_model_1.League.find({}, function (err, leagues) {
            if (err) {
                return res.status(500).json(err);
            }
            ;
            return res.status(200).json(leagues);
        });
    };
    LeagueController.prototype.show = function (req, res) {
        league_model_1.League.findById(req.params.id, function (err, league) {
            if (err) {
                return res.status(500).json(err);
            }
            ;
            if (!league) {
                return res.status(404);
            }
            return res.status(200).json(league);
        });
    };
    LeagueController.prototype.create = function (req, res) {
        var newLeague = req.body;
        league_model_1.League.create(newLeague, function (err, league) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(201).json(league);
        });
    };
    LeagueController.prototype.update = function (req, res) {
        league_model_1.League.findById(req.params.id, function (err, league) {
            if (err) {
                return res.status(500).json(err);
            }
            if (!league) {
                return res.sendStatus(404);
            }
            _.merge(league, req.body);
            league.save(function (err) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(league);
            });
        });
    };
    LeagueController.prototype.destroy = function (req, res) {
        league_model_1.League.findById(req.params.id, function (err, league) {
            if (err) {
                return res.status(500).json(err);
            }
            if (!league) {
                return res.sendStatus(404);
            }
            league.remove(function (err) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.sendStatus(200);
            });
        });
    };
    return LeagueController;
}());
exports.LeagueController = LeagueController;
//# sourceMappingURL=league.controller.js.map