"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var leaderboardSchema = new Schema({
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Season"
    },
    round: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Refreshed', 'UpdatingScores', 'UpdatingRankings'],
        default: 'Refreshed'
    },
    userCount: {
        type: Number
    },
    lastStatusUpdate: {
        type: String
    }
});
exports.Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
//# sourceMappingURL=leaderboard.model.js.map