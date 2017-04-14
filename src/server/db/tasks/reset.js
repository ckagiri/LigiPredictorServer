"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var mongoose = require("mongoose");
var common_1 = require("./common");
function resetCollections() {
    console.log('Resetting collections.');
    async.waterfall([common_1.connect, common_1.drop, common_1.seed], function (err, results) {
        if (err)
            throw err;
        mongoose.connection.close();
    });
}
resetCollections();
//# sourceMappingURL=reset.js.map