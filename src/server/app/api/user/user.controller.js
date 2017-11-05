"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repositories_1 = require("../../../db/repositories");
var userRepo = new repositories_1.UserRepo();
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.show = function (req, res) {
        var id = req.params.id;
        userRepo.findOne({ _id: id })
            .subscribe(function (user) {
            res.status(200).json(user);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    UserController.prototype.list = function (req, res) {
        userRepo.findAll()
            .subscribe(function (users) {
            res.status(200).json(users);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map