"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var common_1 = require("../common");
var prediction_processor_1 = require("../../../helpers/prediction-processor");
var FinishedFixturePublishHandler = /** @class */ (function () {
    function FinishedFixturePublishHandler() {
    }
    FinishedFixturePublishHandler.prototype.handle = function (changedFixture, roundFixtures) {
        var boards = {};
        console.log("prediction handler");
        return common_1.userRepo.findAll()
            .flatMap(function (users) {
            return Rx.Observable.from(users);
        })
            .flatMap(function (user) {
            return Rx.Observable.of({
                user: user, fixture: changedFixture
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture;
            var season = fixture.season, round = fixture.round;
            return common_1.predictionRepo.pickJoker({ user: user, season: season, round: round, pick: roundFixtures })
                .map(function (jokerPrediction) {
                return {
                    user: user, fixture: fixture, jokerPrediction: jokerPrediction
                };
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, jokerPrediction = map.jokerPrediction;
            if (jokerPrediction.fixture.toString() == fixture._id.toString()) {
                return Rx.Observable.of({
                    user: user, fixture: fixture, prediction: jokerPrediction
                });
            }
            return common_1.predictionRepo.findOneOrCreate(user, fixture)
                .map(function (prediction) {
                return {
                    user: user, fixture: fixture, prediction: prediction
                };
            });
        })
            .flatMap(function (map) {
            var user = map.user, fixture = map.fixture, prediction = map.prediction;
            var score = prediction_processor_1.predictionProcessor.process(prediction.choice, fixture.result);
            prediction.scorePoints = score.scorePoints;
            prediction.points = score.points;
            prediction.goalDiff = score.goalDiff;
            return Rx.Observable.of({ user: user, fixture: fixture, prediction: prediction });
        });
    };
    return FinishedFixturePublishHandler;
}());
exports.finishedFixturePublishHandler = new FinishedFixturePublishHandler();
//# sourceMappingURL=finishedFixture-publish.js.map