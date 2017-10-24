"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
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
        if (req['user'] == null) {
            res.status(500).json({ error: 'Unauthenticated' });
        }
        var predictionsDict = req.body.predictions;
        var user = req['user'];
        var errors = [];
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
            .flatMap(function (map) {
            var fixture = map.fixture, reqPrediction = map.reqPrediction;
            var observable;
            if (fixture.status != 'SCHEDULED' && fixture.status != 'TIMED') {
                observable = Rx.Observable.throw(new Error(fixture.slug + ": is not scheduled"));
            }
            else {
                observable = predictionRepo.findOneAndUpdateOrCreate(user._id, fixture, reqPrediction.choice);
            }
            return observable.map(function (prediction) { return prediction; })
                .catch(function (error) {
                var message = "Error: " + (error.message || 'damn');
                errors.push(message);
                console.log("Caught Error, continuing");
                return Rx.Observable.empty();
            });
        })
            .toArray()
            .subscribe(function (preds) {
            var predictions = _.filter(preds, function (p) { return p !== null; });
            res.status(200).json(predictions);
        }, function (err) {
            res.status(500).json(err);
        });
    };
    PredictionController.prototype.pickJoker = function (req, res) {
        if (req['user'] == null) {
            res.status(500).json({ error: 'Unauthenticated' });
        }
        var selectedFixture = req.body;
        var user = req['user']._id;
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