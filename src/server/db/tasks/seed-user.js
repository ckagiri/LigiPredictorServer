//process.env.NODE_ENV = process.env.NODE_ENV || 'development';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var user_model_1 = require("../../db/models/user.model");
var environment_1 = require("../../config/environment");
var Promise = require('bluebird');
mongoose.Promise = Promise;
//Add user to the system
var user1 = new user_model_1.User({
    userName: "ckagiri",
    displayName: "Charles Kagiri",
    email: "charleskagiri@gmail.com",
    password: "redwire",
    roles: ["admin"]
});
function seedUser() {
    console.log('Seeding user.');
    mongoose.connect(environment_1.config.mongo.uri);
    console.log(environment_1.config.mongo.uri);
    user1.save(function (err) {
        if (err) {
            console.log(err.message);
        }
    });
    mongoose.connection.close();
}
seedUser();
//# sourceMappingURL=seed-user.js.map