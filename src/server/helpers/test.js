"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prediction_processor_1 = require("./prediction-processor");
var zero = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 0, goalsAwayTeam: 1
});
var one = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 2
});
var two = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 1
});
var three = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 2
});
var four = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 0
});
var five = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 0
});
var five2 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 0, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 1
});
var six = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
var seven = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
var seven2 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
    goalsHomeTeam: 3, goalsAwayTeam: 3
});
var seven3 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
var eight = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 0
});
var eight2 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 1, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 1, goalsAwayTeam: 1
});
var nine = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
var ten = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 2
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 2
});
var ten2 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 2
}, {
    goalsHomeTeam: 3, goalsAwayTeam: 2
});
var a = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 3, goalsAwayTeam: 0
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
var a2 = prediction_processor_1.predictionProcessor.process({
    goalsHomeTeam: 2, goalsAwayTeam: 1
}, {
    goalsHomeTeam: 2, goalsAwayTeam: 0
});
console.log("chalo");
//# sourceMappingURL=test.js.map