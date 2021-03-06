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
            router.get('/', this.controller.list);
            router.get('/mine', this.controller.mine);
            router.post('/pick-joker', this.controller.pickJoker);
            router.get('/:id', this.controller.show);
            router.post('/', this.controller.create);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return PredictionRouter;
}());
exports.predictionRouter = new PredictionRouter();
//# sourceMappingURL=prediction.route.js.map