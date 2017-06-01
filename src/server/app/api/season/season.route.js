"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var season_controller_1 = require("../season/season.controller");
var router = express_1.Router();
var SeasonRouter = (function () {
    function SeasonRouter() {
        this.controller = new season_controller_1.SeasonController();
    }
    Object.defineProperty(SeasonRouter.prototype, "routes", {
        get: function () {
            router.get('/', this.controller.list);
            router.get('/:id', this.controller.show);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return SeasonRouter;
}());
exports.seasonRouter = new SeasonRouter();
//# sourceMappingURL=season.route.js.map