"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    displayName: String,
    userName: {
        type: String,
        unique: true,
        lowercase: true
    },
    picture: String,
    facebook: String,
    google: String,
    twitter: String,
    roles: [String]
});
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=user.model.js.map