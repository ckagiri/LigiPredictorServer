"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var goaldiff_calculator_1 = require("./goaldiff-calculator");
var points_calculator_1 = require("./points-calculator");
var PredictionProcessor = /** @class */ (function () {
    function PredictionProcessor() {
    }
    PredictionProcessor.prototype.process = function (choice, result) {
        var goalDiff = goaldiff_calculator_1.goalDiffCalculator.process(choice, result);
        var scorePoints = points_calculator_1.pointsCalculator.process(choice, result);
        var points = Object.keys(scorePoints)
            .reduce(function (sum, key) {
            return sum + scorePoints[key];
        }, 0);
        return { scorePoints: scorePoints, points: points, goalDiff: goalDiff };
    };
    return PredictionProcessor;
}());
exports.predictionProcessor = new PredictionProcessor();
//# sourceMappingURL=prediction-processor.js.map