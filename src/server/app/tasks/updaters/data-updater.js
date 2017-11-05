"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var common_1 = require("../common");
var season_dbupdate_1 = require("../handlers/season-dbupdate");
var Moment = require('moment');
var DataUpdater = /** @class */ (function () {
    function DataUpdater() {
    }
    DataUpdater.prototype.update = function (callback) {
        Rx.Observable.fromPromise(common_1.client.getCompetitions(2017))
            .subscribe(function (competitions) {
            season_dbupdate_1.seasonUpdateHandler.handle(competitions.data);
        }, function (err) { console.log("Oops... " + err); });
        callback(Moment().add(1, 'days'));
    };
    return DataUpdater;
}());
exports.dataUpdater = new DataUpdater();
//# sourceMappingURL=data-updater.js.map