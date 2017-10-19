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
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    status: {
        type: String,
        enum: ['REFRESHED', 'UPDATING_SCORES', 'UPDATING_RANKINGS'],
        default: 'REFRESHED'
    },
    boardType: {
        type: String,
        enum: ['GLOBAL_SEASON', 'GLOBAL_ROUND', 'GLOBAL_MONTH', 'MINI_LEAGUE'],
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