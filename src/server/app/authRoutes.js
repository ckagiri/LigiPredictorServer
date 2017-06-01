"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var notfound_1 = require("./utils/notfound");
var authGoogle = require("./auth/auth.google");
var authFacebook = require("./auth/auth.facebook");
var authLocal = require("./auth/auth.local");
var helpers_1 = require("./auth/helpers");
var router = express_1.Router();
router.post('/google', authGoogle.googleAuth);
router.post('/facebook', authFacebook.facebookAuth);
router.post('/signup', authLocal.signup);
router.post('/login', authLocal.login);
router.post('/unlink', helpers_1.ensureAuthenticated, helpers_1.unlink);
router.get('/*', notfound_1.notFoundMiddleware);
exports.routes = router;
//# sourceMappingURL=authRoutes.js.map