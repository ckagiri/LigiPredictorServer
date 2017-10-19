"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prediction_model_1 = require("../models/prediction.model");
var Rx = require("rxjs");
var PredictionRepo = (function () {
    function PredictionRepo() {
        var _this = this;
        this.findOneOrCreate = function (user, fixture) {
            var fixtureId = fixture._id, fixtureSlug = fixture.slug, season = fixture.season, round = fixture.round, odds = fixture.odds;
            var query = { user: user, fixture: fixtureId }, pred = { user: user, fixture: fixtureId, fixtureSlug: fixtureSlug, season: season, round: round, choice: {} };
            var matchScores = _this.getMatchScores(odds);
            pred.choice = matchScores;
            return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
                prediction_model_1.Prediction.findOne(query, function (err, result) {
                    if (err)
                        return reject(err);
                    if (result)
                        return resolve(result);
                    prediction_model_1.Prediction.create(pred, function (err, result) {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                });
            }));
        };
        this.findOneAndUpdateOrCreate = function (user, fixture, choice) {
            var fixtureId = fixture._id, fixtureSlug = fixture.slug, season = fixture.season, round = fixture.round, odds = fixture.odds;
            var query = { user: user, fixture: fixtureId }, pred = { user: user, fixture: fixtureId, fixtureSlug: fixtureSlug, season: season, round: round, choice: choice }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
            return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
                prediction_model_1.Prediction.findOneAndUpdate(query, pred, options)
                    .lean()
                    .exec(function (err, prediction) {
                    if (err)
                        reject(err);
                    if (!prediction)
                        reject(new Error("Failed to load Prediction - user: " + user + " fixture: " + fixture));
                    return resolve(prediction);
                });
            }));
        };
    }
    PredictionRepo.prototype.findOne = function (user, fixture) {
        return Rx.Observable.fromPromise(prediction_model_1.Prediction.findOne({ user: user, fixture: fixture }).lean());
    };
    PredictionRepo.prototype.update = function (prediction, options) {
        if (options === void 0) { options = { overwrite: false }; }
        var _id = prediction._id;
        return Rx.Observable.fromPromise(prediction_model_1.Prediction.update({ _id: _id }, prediction, options));
    };
    PredictionRepo.prototype.create = function (predictions) {
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            prediction_model_1.Prediction.create(predictions, function (err, savedPredictions) {
                if (err)
                    reject(err);
                return resolve(savedPredictions);
            });
        }));
    };
    PredictionRepo.prototype.insert = function (prediction) {
        return Rx.Observable.fromPromise(prediction_model_1.Prediction.create(prediction));
    };
    PredictionRepo.prototype.getMatchScores = function (fixture) {
        return {
            goalsHomeTeam: Math.floor(Math.random() * 3),
            goalsAwayTeam: Math.floor(Math.random() * 3),
            isComputerGenerated: true
        };
    };
    return PredictionRepo;
}());
exports.PredictionRepo = PredictionRepo;
//# sourceMappingURL=repo.prediction.js.map