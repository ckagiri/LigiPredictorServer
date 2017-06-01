"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
;
var predictionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required']
    },
    fixture: {
        type: Schema.Types.ObjectId,
        ref: 'Fixture',
        index: true,
        required: [true, 'Fixture required']
    },
    choice: {
        goalsHomeTeam: {
            type: Number
        },
        goalsAwayTeam: {
            type: Number
        },
        isComputerGenerated: {
            type: Boolean,
            default: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    scorePoints: {
        matchOutcome: {
            type: Number
        },
        goalDifference: {
            type: Number
        },
        teamScore: {
            type: Number
        },
        matchScore: {
            type: Number
        },
        teamScoreOfTwoOrMore: {
            type: Number
        },
        plusOrMinusOneGoal: {
            type: Number
        }
    },
    points: {
        type: Number
    },
    goalDiff: {
        type: Number
    }
});
exports.Prediction = mongoose.model('Prediction', predictionSchema);
//# sourceMappingURL=prediction.model.js.map