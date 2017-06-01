"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var round_model_1 = require("./round.model");
var Schema = mongoose.Schema;
;
var seasonSchema = new Schema({
    league: {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "League",
            index: true,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    aliases: {
        type: [String]
    },
    rounds: {
        type: [round_model_1.roundSchema]
    },
    teams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }],
    currentRound: {
        type: Number
    },
    numberOfRounds: {
        type: Number
    },
    numberOfTeams: {
        type: Number
    },
    numberOfGames: {
        type: Number
    },
    seasonStart: {
        type: Date
    },
    seasonEnd: {
        type: Date
    },
    api_detail: {
        type: Schema.Types.Mixed
    }
});
exports.Season = mongoose.model('Season', seasonSchema);
//# sourceMappingURL=season.model.js.map