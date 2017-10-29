"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("../../db/models/user.model");
var helpers_1 = require("./helpers");
function login(req, res) {
    user_model_1.User.findOne({ email: req.body.email }, '+password', function (err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Invalid email and/or password' });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Invalid email and/or password' });
            }
            var token = helpers_1.createJWT(user);
            res.send({ token: token, user: user });
        });
    });
}
exports.login = login;
function signup(req, res) {
    user_model_1.User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken' });
        }
        var user = new user_model_1.User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function (err, savedUser) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            var token = helpers_1.createJWT(savedUser);
            res.send({ token: token, user: savedUser });
        });
    });
}
exports.signup = signup;
//# sourceMappingURL=auth.local.js.map