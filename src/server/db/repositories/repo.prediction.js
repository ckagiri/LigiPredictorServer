"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prediction_model_1 = require("../models/prediction.model");
var fixture_model_1 = require("../models/fixture.model");
var Rx = require("rxjs");
var PredictionRepo = (function () {
    function PredictionRepo() {
        var _this = this;
        this.findOneOrCreate = function (user, fixture) {
            var query = { user: user, fixture: fixture._id };
            return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
                prediction_model_1.Prediction.findOne(query, function (err, result) {
                    if (err)
                        return reject(err);
                    if (result)
                        return resolve(result);
                    var fixtureId = fixture._id, fixtureSlug = fixture.slug, season = fixture.season, round = fixture.round, odds = fixture.odds;
                    var pred = { user: user, fixture: fixtureId, fixtureSlug: fixtureSlug, season: season, round: round, choice: {} };
                    var matchScores = _this.getMatchScores(odds);
                    pred.choice = matchScores;
                    prediction_model_1.Prediction.create(pred, function (err, result) {
                        if (err)
                            return reject(err);
                        return resolve(result);
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
        this.pickJoker = function (opts) {
            var user = opts.user, season = opts.season, round = opts.round, pick = opts.pick;
            return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
                var query = {
                    season: season, round: round, hasJoker: true
                };
                prediction_model_1.Prediction.findOne(query, function (err, currentJoker) {
                    var newJokerFixtureId;
                    if (pick instanceof Array) {
                        if (currentJoker) {
                            resolve(currentJoker);
                        }
                        else {
                            newJokerFixtureId = pick[Math.floor(Math.random() * pick.length)];
                            _this.pickJokerFixture(currentJoker, newJokerFixtureId, true, resolve, reject);
                        }
                    }
                    else {
                        newJokerFixtureId = pick;
                        _this.pickJokerFixture(currentJoker, newJokerFixtureId, false, resolve, reject);
                    }
                });
            }));
        };
        this.pickJokerFixture = function (currentJoker, newJokerFixtureId, autoPicked, resolve, reject) {
            fixture_model_1.Fixture.findById(newJokerFixtureId, function (err, newJokerFixture) {
                if (!newJokerFixture)
                    return reject(new Error('Bad'));
                var user = currentJoker.user;
                var fixtureSlug = newJokerFixture.slug, season = newJokerFixture.season, round = newJokerFixture.round, odds = newJokerFixture.odds;
                if (newJokerFixture.status === 'SCHEDULED' || newJokerFixture.status === 'TIMED') {
                    prediction_model_1.Prediction.findOne({ fixture: newJokerFixtureId }, function (err, newJokerPrediction) {
                        if (err)
                            return reject(err);
                        var newJoker;
                        if (!newJokerPrediction) {
                            var matchScores = _this.getMatchScores(odds);
                            newJoker = {
                                user: user, fixture: newJokerFixtureId, fixtureSlug: fixtureSlug, season: season, round: round,
                                hasJoker: true, jokerAutoPicked: autoPicked, choice: matchScores
                            };
                        }
                        else {
                            newJoker = newJokerPrediction;
                            newJoker.hasJoker = true;
                        }
                        currentJoker.hasJoker = false;
                        prediction_model_1.Prediction.create([currentJoker, newJoker], function (err, savedPredictions) {
                            if (err)
                                reject(err);
                            if (!savedPredictions) {
                                return reject(new Error("Failed to saved predictions"));
                            }
                            var currentNewJoker = savedPredictions.filter(function (n) {
                                return n.fixture === newJoker.fixture;
                            })[0];
                            console.log('currentNewJoker', currentNewJoker);
                            return resolve(currentNewJoker);
                        });
                    });
                }
                else {
                    reject(new Error('Fixture not scheduled'));
                }
            });
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