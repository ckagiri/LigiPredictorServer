"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'development';
var mongoose = require("mongoose");
var environment_1 = require("../../config/environment");
var db = require("../../db");
var queue_1 = require("./queue");
var main_job_1 = require("./jobs/main.job");
var Promise = require('bluebird');
mongoose.Promise = Promise;
db.init(environment_1.config.mongo.uri);
var q = new queue_1.Queue(50, 1000 * 60);
q.addJob(new main_job_1.MainJob());
//# sourceMappingURL=main.js.map