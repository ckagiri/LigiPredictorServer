"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var admin_controller_1 = require("./admin.controller");
var router = express_1.Router();
var AdminRouter = (function () {
    function AdminRouter() {
        this.controller = new admin_controller_1.AdminController();
    }
    Object.defineProperty(AdminRouter.prototype, "routes", {
        get: function () {
            router.get('/afd/next-update', this.controller.nextMatchUpdate);
            router.get('/afd/fixture/:id', this.controller.showAfdFixture);
            router.get('/afd/fixtures/:matchday', this.controller.showAfdMatchdayFixtures);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return AdminRouter;
}());
exports.adminRouter = new AdminRouter();
//# sourceMappingURL=admin.route.js.map