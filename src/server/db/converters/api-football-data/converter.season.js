"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var environment_1 = require("../../../config/environment");
var provider = environment_1.config.api_providers.api_football_data.name;
var SeasonConverter = /** @class */ (function () {
    function SeasonConverter() {
        this.provider = provider;
    }
    SeasonConverter.prototype.from = function (obj) {
        return Rx.Observable.of({
            api_detail: (_a = {},
                _a[this.provider] = {
                    id: obj.id
                },
                _a),
            caption: obj.caption,
            currentRound: obj.currentMatchday
        });
        var _a;
    };
    return SeasonConverter;
}());
exports.SeasonConverter = SeasonConverter;
//# sourceMappingURL=converter.season.js.map