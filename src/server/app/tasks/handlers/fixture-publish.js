"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var common_1 = require("../common");
var prediction_processor_1 = require("../../../helpers/prediction-processor");
var PredictionHandler = (function () {
    function PredictionHandler() {
    }
    PredictionHandler.prototype.handle = function (changedFixture) {
        var boards = {};
        console.log("prediction handler");
        if (changedFixture.status === 'FINISHED') {
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
                return common_1.predictionRepo.findOneOrCreate(user, fixture, fixture.odds)
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
        }
        return Rx.Observable.throw(new Error("Oops!! fixture: " + changedFixture._id));
    };
    return PredictionHandler;
}());
exports.predictionHandler = new PredictionHandler();
//           oError: (err: any) => console.log(`Oops... ${err}`),
//           onComplete: () => {
//             leaderboardRepo.findAll({q: season})
//               .flatMap((standings: any) => {
//                 return Rx.Observable.from(standings);
//               })
//               .flatMap((standing: any) => {
//                 let position = 1;
//                 let previousPosition = standing.posNew;
//                 standing.posOld = previousPosition;
//                 standing.posNew = position;
//                 return leaderboardRepo.insert(standing)
//               })
//               .subscribe((standing: any) => {
//               });
//         }
//       })
//   }
// } 
//# sourceMappingURL=fixture-publish.js.map