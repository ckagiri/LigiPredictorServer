"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scheduler_1 = require("../../tasks/scheduler");
var common_1 = require("../../tasks/common");
var Rx = require("rxjs");
var AdminController = (function () {
    function AdminController() {
    }
    AdminController.prototype.nextMatchUpdate = function (req, res) {
        var _a = scheduler_1.nextMatchUpdate(), nextMatchUpdateMs = _a.nextMatchUpdateMs, previousMatchUpdateMs = _a.previousMatchUpdateMs, nextMatchUpdateDate = _a.nextMatchUpdateDate;
        var nextTime = scheduler_1.msToTime(nextMatchUpdateMs);
        var prevTime = scheduler_1.msToTime(previousMatchUpdateMs);
        res.status(200).json({ nextTime: nextTime, prevTime: prevTime, nextMatchUpdateDate: nextMatchUpdateDate });
    };
    AdminController.prototype.showAfdFixture = function (req, res) {
        var compId = 445;
        var id = req.params.id;
        Rx.Observable.fromPromise(common_1.client.getFixture(compId, id))
            .subscribe(function (fixture) {
            res.status(200).json(fixture);
        }, function (err) {
            res.status(500).json({ error: 'bad' });
        });
    };
    AdminController.prototype.showAfdMatchdayFixtures = function (req, res) {
        var compId = 445;
        var matchday = req.params.matchday;
        matchday = parseInt(matchday);
        Rx.Observable.fromPromise(common_1.client.getFixtures(compId, { matchday: matchday }))
            .subscribe(function (fixtures) {
            res.status(200).json(fixtures);
        }, function (err) {
            res.status(500).json({ error: 'bad' });
        });
    };
    return AdminController;
}());
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map