"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prediction_controller_1 = require("./prediction.controller");
var router = express_1.Router();
var PredictionRouter = (function () {
    function PredictionRouter() {
        this.controller = new prediction_controller_1.PredictionController();
    }
    Object.defineProperty(PredictionRouter.prototype, "routes", {
        get: function () {
            router.get('/mine', this.controller.list);
            router.get('/:id', this.controller.show);
            router.post('/', this.controller.create);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return PredictionRouter;
}());
exports.leagueRouter = new PredictionRouter();
//# sourceMappingURL=prediction.route.js.map