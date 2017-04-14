"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
;
var fixtureSchema = new Schema({
    season: {
        type: Schema.Types.ObjectId,
        ref: 'Season'
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    round: {
        type: Number
    },
    homeTeam: {
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
            ref: "Team",
            index: true,
            required: true
        }
    },
    awayTeam: {
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
            ref: "Team",
            index: true,
            required: true
        }
    },
    status: {
        type: String
    },
    result: {
        goalsHomeTeam: {
            type: Number
        },
        goalsAwayTeam: {
            type: Number
        }
    },
    odds: {
        homeWin: {
            type: Number,
            default: 1
        },
        awayWin: {
            type: Number,
            default: 1
        },
        draw: {
            type: Number,
            default: 1
        }
    },
    api_detail: {
        type: Schema.Types.Mixed
    }
});
exports.Fixture = mongoose.model('Fixture', fixtureSchema);
//# sourceMappingURL=fixture.model.js.map