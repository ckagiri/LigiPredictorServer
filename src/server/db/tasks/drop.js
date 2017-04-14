"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var mongoose = require("mongoose");
var common_1 = require("./common");
function dropCollections() {
    console.log('Dropping collections.');
    async.waterfall([common_1.connect, common_1.drop], function (err, results) {
        if (err)
            throw err;
        mongoose.connection.close();
    });
}
dropCollections();
//# sourceMappingURL=drop.js.map