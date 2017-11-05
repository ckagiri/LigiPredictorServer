"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var SeasonController = /** @class */ (function () {
    function SeasonController() {
    }
    SeasonController.prototype.show = function (req, res) {
        var id = req.params.id;
        var source = null;
        if (id == 'default') {
            source = seasonRepo.getDefault();
        }
        if (isMongoId_1.default(id)) {
            source = seasonRepo.findOne({ _id: id });
        }
        if (source == null) {
            res.status(500).json("bad request");
        }
        source.subscribe(function (season) {
            res.status(200).json(season);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    SeasonController.prototype.list = function (req, res) {
        var slug = req.params.leagueId;
        seasonRepo.findAll({ 'league.slug': slug })
            .subscribe(function (seasons) {
            res.status(200).json(seasons);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return SeasonController;
}());
exports.SeasonController = SeasonController;
//# sourceMappingURL=season.controller.js.map