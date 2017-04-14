"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var matchround_model_1 = require("./matchround.model");
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
        type: [matchround_model_1.matchRoundSchema]
    },
    currentRound: {
        type: Number
    },
    api_detail: {
        type: Schema.Types.Mixed
    }
});
exports.Season = mongoose.model('Season', seasonSchema);
//# sourceMappingURL=season.model.js.map