"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var profile_1 = require("./api/user/profile");
var user_route_1 = require("./api/user/user.route");
var league_route_1 = require("./api/league/league.route");
var fixture_route_1 = require("./api/fixture/fixture.route");
var prediction_route_1 = require("./api/prediction/prediction.route");
var leaderboard_route_1 = require("./api/leaderboard/leaderboard.route");
var season_route_1 = require("./api/season/season.route");
var notfound_1 = require("./utils/notfound");
var helpers_1 = require("./auth/helpers");
var router = express_1.Router();
router.get('/ping', function (req, res) {
    res.json({ pong: Date.now() });
});
router.use('/me', profile_1.profileRouter.routes);
router.use('/users', user_route_1.userRouter.routes);
router.use('/leagues', league_route_1.leagueRouter.routes);
router.use('/seasons', season_route_1.seasonRouter.routes);
router.use('/matches', helpers_1.attachUser, fixture_route_1.fixtureRouter.routes);
router.use('/predictions', helpers_1.attachUser, prediction_route_1.predictionRouter.routes);
router.use('/leaderboard', helpers_1.attachUser, leaderboard_route_1.leaderboardRouter.routes);
router.get('/*', notfound_1.notFoundMiddleware);
exports.routes = router;
//# sourceMappingURL=apiRoutes.js.map