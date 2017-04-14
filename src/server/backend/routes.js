"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var league_route_1 = require("./api/league/league.route");
var notfound_1 = require("./utils/notfound");
var data = require("./data");
var router = express_1.Router();
router.get('/people', function (req, res, next) {
    res.status(200).send(data.getPeople());
});
router.get('/ping', function (req, res) {
    res.json({ pong: Date.now() });
});
router.use('/leagues', league_route_1.leagueRouter.routes);
router.get('/*', notfound_1.notFoundMiddleware);
exports.routes = router;
//# sourceMappingURL=routes.js.map