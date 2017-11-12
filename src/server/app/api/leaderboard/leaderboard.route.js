"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var leaderboard_controller_1 = require("../leaderboard/leaderboard.controller");
var router = express_1.Router();
var LeaderboardRouter = (function () {
    function LeaderboardRouter() {
        this.controller = new leaderboard_controller_1.LeaderboardController();
    }
    Object.defineProperty(LeaderboardRouter.prototype, "routes", {
        get: function () {
            router.get('/', this.controller.seasonList);
            router.get('/league/:league/season/:season', this.controller.seasonList);
            router.get('/league/:league/season/:season/round/:round', this.controller.seasonRoundList);
            router.get('/league/:league/season/:season/year/:year/month/:month', this.controller.seasonMonthList);
            router.get('/:id', this.controller.show);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return LeaderboardRouter;
}());
exports.leaderboardRouter = new LeaderboardRouter();
//# sourceMappingURL=leaderboard.route.js.map