"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var league_route_1 = require("./api/league/league.route");
var router = express_1.Router();
router.get('/ping', function (req, res) {
    res.json({ pong: Date.now() });
});
router.use('/leagues', league_route_1.leagueRouter.routes);
exports.routes = router;
//# sourceMappingURL=routes.js.map