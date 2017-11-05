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
            router.get('/:leagueId/seasons', this.controller.listSeasons);
            router.get('/:leagueId/seasons/:seasonId', this.controller.showSeason);
            router.get('/:leagueId/seasons/:seasonId/teams', this.controller.listTeams);
            router.get('/:leagueId/seasons/:seasonId/rounds', this.controller.listRounds);
            router.get('/:leagueId/seasons/:seasonId/rounds/:roundId', this.controller.showRound);
            router.get('/:leagueId/seasons/:seasonId/fixtures', this.controller.listFixtures);
            router.get('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures', this.controller.listFixtures);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return LeagueRouter;
}());
exports.leagueRouter = new LeagueRouter();
//# sourceMappingURL=league.route.js.map