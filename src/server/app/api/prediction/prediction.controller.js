"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var Rx = require("rxjs");
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
        var predictionsDict = req.body.predictions;
        var errors = [];
        var user = req['user'];
        var reqPredictions = Object.keys(predictionsDict).map(function (key) {
            return {
                _id: predictionsDict[key]._id,
                fixture: key,
                user: user._id,
                choice: {
                    goalsHomeTeam: predictionsDict[key].goalsHomeTeam,
                    goalsAwayTeam: predictionsDict[key].goalsAwayTeam,
                    isComputerGenerated: false
                }
            };
        }).filter(function (reqPrediction) {
            return reqPrediction.choice.goalsHomeTeam != null &&
                reqPrediction.choice.goalsAwayTeam != null;
        });
        Rx.Observable.from(reqPredictions)
            .flatMap(function (reqPrediction) {
            return fixtureRepo.findOne({ _id: reqPrediction.fixture })
                .map(function (fixture) {
                return {
                    fixture: fixture,
                    reqPrediction: reqPrediction
                };
            });
        })
            .switchMap(function (map) {
            var fixture = map.fixture, reqPrediction = map.reqPrediction;
            return predictionRepo.findOneAndUpdateOrCreate(user._id, fixture, reqPrediction.choice)
                .map(function (prediction) {
                return prediction;
            })
                .catch(function (error) {
                return Rx.Observable.of(error);
            });
        }).map(function (prediction) {
            if (prediction instanceof Error) {
                var message = "Error: " + (prediction.message || 'damn');
                errors.push(message);
                return message;
            }
            return prediction;
        })
            .subscribe(function (predictions) {
            //do joker
            res.status(200).json(predictions);
        }, function (err) {
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.pickJoker = function (req, res) {
        var selectedFixture = req.body.fixture;
        var user = req['user'];
        var pick = selectedFixture._id, season = selectedFixture.season, round = selectedFixture.round;
        var options = {
            user: user, season: season, round: round, pick: pick
        };
        predictionRepo.pickJoker(options)
            .subscribe(function (joker) {
            res.status(200).json(joker);
        }, function (err) {
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.mine = function (req, res) {
        fixtureRepo.findAll()
            .subscribe(function (fixtures) {
            res.status(200).json(fixtures);
        }, function (err) {
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