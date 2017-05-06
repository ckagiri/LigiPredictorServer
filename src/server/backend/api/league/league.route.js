"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var league_controller_1 = require("./league.controller");
var router = express_1.Router();
var LeagueRouter = (function () {
    function LeagueRouter() {
        this.controller = new league_controller_1.LeagueController();
    }
    Object.defineProperty(LeagueRouter.prototype, "routes", {
        get: function () {
            router.get('/', this.controller.list);
            router.get('/:id', this.controller.show);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return LeagueRouter;
}());
exports.leagueRouter = new LeagueRouter();
//# sourceMappingURL=league.route.js.map