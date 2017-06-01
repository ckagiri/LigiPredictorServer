"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var jwt = require("jwt-simple");
var environment_1 = require("../../config/environment");
var user_model_1 = require("../../db/models/user.model");
function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, environment_1.config.TOKEN_SECRET);
}
exports.createJWT = createJWT;
function ensureAuthenticated(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.header('Authorization').split(' ')[1];
    var payload = null;
    try {
        payload = jwt.decode(token, environment_1.config.TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }
    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    user_model_1.User.findById(payload.sub, function (err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User no longer exists.' });
        }
        req['user'] = user;
        next();
    });
}
exports.ensureAuthenticated = ensureAuthenticated;
function unlink(req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'google'];
    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({ message: 'Unknown OAuth Provider' });
    }
    user_model_1.User.findById(req['user']._id, function (err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        user[provider] = undefined;
        user.save(function () {
            res.status(200).end();
        });
    });
}
exports.unlink = unlink;
function attachUser(req, res, next) {
    var token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    var payload = null;
    try {
        payload = token && jwt.decode(token, environment_1.config.TOKEN_SECRET);
    }
    catch (err) {
    }
    if (payload && payload.exp <= moment().unix()) {
        payload = null;
    }
    if (payload != null) {
        user_model_1.User.findById(payload.sub, function (err, user) {
            req['user'] = user;
            next();
        });
    }
    else {
        next();
    }
}
exports.attachUser = attachUser;
//# sourceMappingURL=helpers.js.map