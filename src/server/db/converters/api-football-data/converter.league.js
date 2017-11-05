"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var environment_1 = require("../../../config/environment");
var provider = environment_1.config.api_providers.api_football_data.name;
var LeagueConverter = /** @class */ (function () {
    function LeagueConverter() {
        this.provider = provider;
    }
    LeagueConverter.prototype.from = function (obj) {
        return Rx.Observable.of({
            api_detail: (_a = {},
                _a[this.provider] = {
                    id: obj.slug
                },
                _a),
            name: obj.name,
            code: obj.code,
            slug: obj.slug
        });
        var _a;
    };
    return LeagueConverter;
}());
exports.LeagueConverter = LeagueConverter;
//# sourceMappingURL=converter.league.js.map