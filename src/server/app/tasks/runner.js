"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var environment_1 = require("../../config/environment");
exports.toObjectId = function (_id) {
    return mongoose.Types.ObjectId.createFromHexString(_id);
};
mongoose.connect(environment_1.config.mongo.uri, environment_1.config.mongo.options);
//# sourceMappingURL=runner.js.map