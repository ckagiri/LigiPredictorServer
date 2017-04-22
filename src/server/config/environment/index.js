"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var _ = require("lodash");
function requiredProcessEnv(name) {
    console.log(process.env[name]);
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}
// All configurations will extend these options
// ============================================
var all = {
    env: requiredProcessEnv('NODE_ENV'),
    // Root path of server
    rootPath: path.normalize(__dirname + '/../../../'),
    // Server port
    port: process.env.PORT || 9000,
    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    }
};
// Export the config object based on the NODE_ENV
// ==============================================
exports.config = _.merge(all, require('./shared'), require('./' + process.env.NODE_ENV) || {});
//# sourceMappingURL=index.js.map