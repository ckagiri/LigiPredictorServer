"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var mongoose = require("mongoose");
var common_1 = require("./common");
function seedCollections() {
    console.log('Seeding collections.');
    async.waterfall([common_1.connect, common_1.seed], function (err, results) {
        if (err)
            throw err;
        mongoose.connection.close();
    });
}
seedCollections();
//# sourceMappingURL=seed.js.map