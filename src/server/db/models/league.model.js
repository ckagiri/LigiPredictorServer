"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
;
var leagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String
    },
    aliases: {
        type: [String]
    }
});
exports.League = mongoose.model('League', leagueSchema);
//# sourceMappingURL=league.model.js.map