"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var helpers_1 = require("../../auth/helpers");
var user_model_1 = require("../../../db/models/user.model");
var router = express_1.Router();
var ProfileRouter = /** @class */ (function () {
    function ProfileRouter() {
    }
    Object.defineProperty(ProfileRouter.prototype, "routes", {
        get: function () {
            router.get('/me', helpers_1.ensureAuthenticated, function (req, res) {
                user_model_1.User.findById(req['user'], function (err, user) {
                    res.send(user);
                });
            });
            router.put('/me', helpers_1.ensureAuthenticated, function (req, res) {
                user_model_1.User.findById(req['user'], function (err, user) {
                    if (!user) {
                        return res.status(400).send({ message: 'User not found' });
                    }
                    user.displayName = req.body.displayName || user.displayName;
                    user.email = req.body.email || user.email;
                    user.save(function (err) {
                        res.status(200).end();
                    });
                });
            });
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return ProfileRouter;
}());
exports.profileRouter = new ProfileRouter();
//# sourceMappingURL=profile.js.map