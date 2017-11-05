"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var user_model_1 = require("../models/user.model");
var UserRepo = /** @class */ (function () {
    function UserRepo() {
    }
    UserRepo.prototype.findOne = function (query, projection) {
        return Rx.Observable.fromPromise(user_model_1.User.findOne(query, projection));
    };
    UserRepo.prototype.findAll = function (query, projection, options) {
        if (query === void 0) { query = {}; }
        return Rx.Observable.fromPromise(user_model_1.User.find(query, projection, options).lean());
    };
    return UserRepo;
}());
exports.UserRepo = UserRepo;
//# sourceMappingURL=repo.user.js.map