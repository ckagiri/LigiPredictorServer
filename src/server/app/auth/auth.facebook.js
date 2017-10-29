"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var jwt = require("jwt-simple");
var environment_1 = require("../../config/environment");
var user_model_1 = require("../../db/models/user.model");
var helpers_1 = require("./helpers");
function facebookAuth(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: environment_1.config.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({ message: accessToken.error.message });
        }
        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: profile.error.message });
            }
            if (req.header('Authorization')) {
                user_model_1.User.findOne({ facebook: profile.id }, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, environment_1.config.TOKEN_SECRET);
                    user_model_1.User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({ message: 'User not found' });
                        }
                        user.facebook = profile.id;
                        user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                        user.displayName = user.displayName || profile.name;
                        user.email = user.email || profile.email;
                        user.save(function (err, savedUser) {
                            if (err) {
                                res.status(500).send({ message: err.message });
                            }
                            var token = helpers_1.createJWT(savedUser);
                            res.send({ token: token, user: savedUser });
                        });
                    });
                });
            }
            else {
                // Step 3. Create a new user account or return an existing one.
                user_model_1.User.findOne({ facebook: profile.id }, function (err, existingUser) {
                    if (existingUser) {
                        var token = helpers_1.createJWT(existingUser);
                        return res.send({ token: token, user: existingUser });
                    }
                    var user = new user_model_1.User();
                    user.facebook = profile.id;
                    user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.displayName = profile.name;
                    user.email = profile.email;
                    user.save(function (err, savedUser) {
                        if (err) {
                            res.status(500).send({ message: err.message });
                        }
                        var token = helpers_1.createJWT(savedUser);
                        res.send({ token: token, user: savedUser });
                    });
                });
            }
        });
    });
}
exports.facebookAuth = facebookAuth;
//# sourceMappingURL=auth.facebook.js.map