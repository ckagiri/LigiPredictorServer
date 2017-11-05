"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fixture_controller_1 = require("./fixture.controller");
var router = express_1.Router();
var FixtureRouter = /** @class */ (function () {
    function FixtureRouter() {
        this.controller = new fixture_controller_1.FixtureController();
    }
    Object.defineProperty(FixtureRouter.prototype, "routes", {
        get: function () {
            router.get('/', this.controller.list);
            router.get('/:id', this.controller.show);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return FixtureRouter;
}());
exports.fixtureRouter = new FixtureRouter();
//# sourceMappingURL=fixture.route.js.map