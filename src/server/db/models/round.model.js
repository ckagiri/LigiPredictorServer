"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
;
exports.roundSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});
//# sourceMappingURL=round.model.js.map