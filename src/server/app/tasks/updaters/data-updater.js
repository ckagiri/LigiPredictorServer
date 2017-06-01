"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Moment = require('moment');
var DataUpdater = (function () {
    function DataUpdater() {
    }
    DataUpdater.prototype.update = function (callback) {
        callback(Moment().add(10, 'minutes'));
    };
    return DataUpdater;
}());
exports.dataUpdater = new DataUpdater();
//# sourceMappingURL=data-updater.js.map