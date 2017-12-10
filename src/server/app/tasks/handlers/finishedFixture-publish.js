"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var common_1 = require("../common");
var prediction_processor_1 = require("../../../helpers/prediction-processor");
var FinishedFixturePublishHandler = (function () {
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
            var season = changedFixture.season, round = changedFixture.round;
            return common_1.predictionRepo.pickJoker({ user: user, season: season, round: round, pick: roundFixtures })
                .map(function (jokerPrediction) {
                return {
                    user: user, jokerPrediction: jokerPrediction
                };
            })
                .catch(function (error) {
                var message = "Error: " + (error.message || 'damn');
                console.log(message);
                console.log("Caught Error, continuing");
                return Rx.Observable.of({
                    user: user, jokerPrediction: null
                });
            });
            ;
        })
            .flatMap(function (map) {
            var user = map.user, jokerPrediction = map.jokerPrediction;
            if (jokerPrediction && jokerPrediction.fixture.toString() == changedFixture._id.toString()) {
                return Rx.Observable.of({
                    user: user, prediction: jokerPrediction
                });
            }
            return common_1.predictionRepo.findOneOrCreate(user, changedFixture)
                .map(function (prediction) {
                return {
                    user: user, prediction: prediction
                };
            });
        })
            .flatMap(function (map) {
            var user = map.user, prediction = map.prediction;
            var fixture = changedFixture;
            var predictionStatus = 'PROCESSED';
            if (fixture.status === 'CANCELED' || fixture.status === 'POSTPONED') {
                predictionStatus = 'CANCELLED';
            }
            if (prediction.status === 'PROCESSED') {
                predictionStatus = 'ALREADY_PROCESSED';
            }
            prediction.status = predictionStatus;
            if (predictionStatus === 'CANCELLED' || predictionStatus === 'ALREADY_PROCESSED') {
                return Rx.Observable.of({ user: user, fixture: fixture, prediction: prediction });
            }
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