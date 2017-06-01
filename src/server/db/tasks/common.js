"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var async = require("async");
var mongoose = require("mongoose");
var models_1 = require("../../db/models");
var environment_1 = require("../../config/environment");
var Promise = require('bluebird');
mongoose.Promise = Promise;
var seedData = require('../../config/seed-data.test');
var seeder = require('mongoose-seeder');
exports.connect = function (callback) {
    mongoose.connect(environment_1.config.mongo.uri);
    mongoose.connection.on('open', callback.bind(callback, null, models_1.default));
};
exports.drop = function (models, callback) {
    async.map(models, function (model, callback) {
        model.collection.remove(callback);
    }, function () {
        callback(null, models);
    });
};
exports.seed = function (models, callback) {
    seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
        .then(function (dbData) {
        callback();
    }).catch(function (err) {
        console.log(err);
        callback(err);
    });
};
//# sourceMappingURL=common.js.map