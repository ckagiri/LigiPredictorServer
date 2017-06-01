"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
;
var teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    shortName: {
        type: String
    },
    code: {
        type: String
    },
    aliases: {
        type: [String]
    },
    api_detail: {
        type: Schema.Types.Mixed
    },
    crestUrl: {
        type: String
    }
});
exports.Team = mongoose.model('Team', teamSchema);
//# sourceMappingURL=team.model.js.map