"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userScoreSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'User required'
    },
    leaderboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leaderboard'
    },
    predictions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prediction"
        }],
    points: {
        type: Number
    },
    pointsOld: {
        type: Number
    },
    goalDiff: {
        type: Number
    },
    goalDiffOld: {
        type: Number
    },
    posOld: {
        type: Number
    },
    posNew: {
        type: Number
    }
});
exports.UserScore = mongoose.model('UserScore', userScoreSchema);
//# sourceMappingURL=user-score.model.js.map