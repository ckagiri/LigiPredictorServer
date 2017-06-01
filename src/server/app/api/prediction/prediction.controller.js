"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var teamRepo = new repositories_1.TeamRepo(new ligi_predictor_1.TeamConverter());
var fixtureRepo = new repositories_1.FixtureRepo(new ligi_predictor_1.FixtureConverter(seasonRepo, repositories_1.TeamRepo));
var predictionRepo = new repositories_1.PredictionRepo();
var PredictionController = (function () {
    function PredictionController() {
    }
    PredictionController.prototype.list = function (req, res) {
        fixtureRepo.findAll()
            .subscribe(function (leagues) {
            res.status(200).json(leagues);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.create = function (req, res) {
        var predictions = req.body;
        var user = req['user'];
        var arr = [];
        for (var key in predictions) {
            var prediction = {
                user: user._id,
                choice: {
                    goalsHomeTeam: predictions[key].goalsHomeTeam,
                    goalsAwayTeam: predictions[key].goalsAwayTeam,
                    isComputerGenerated: false
                },
                fixture: key
            };
            arr.push(prediction);
        }
        predictionRepo.create(arr)
            .subscribe(function (predictions) {
            console.log(predictions);
            res.status(200).json(predictions);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.mine = function (req, res) {
        fixtureRepo.findAll()
            .subscribe(function (leagues) {
            res.status(200).json(leagues);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.show = function (req, res) {
        var id = req.params.id;
        fixtureRepo.findOne({ _id: id })
            .subscribe(function (league) {
            res.status(200).json(league);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return PredictionController;
}());
exports.PredictionController = PredictionController;
//# sourceMappingURL=prediction.controller.js.map