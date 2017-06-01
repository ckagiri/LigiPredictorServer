"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("./user.controller");
var router = express_1.Router();
var UserRouter = (function () {
    function UserRouter() {
        this.controller = new user_controller_1.UserController();
    }
    Object.defineProperty(UserRouter.prototype, "routes", {
        get: function () {
            router.get('/', this.controller.list);
            router.get('/:id', this.controller.show);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return UserRouter;
}());
exports.userRouter = new UserRouter();
//# sourceMappingURL=user.route.js.map