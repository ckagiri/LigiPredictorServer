"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var environment_1 = require("../../../config/environment");
var provider = environment_1.config.api_providers.api_football_data.name;
var TeamConverter = /** @class */ (function () {
    function TeamConverter() {
        this.provider = provider;
    }
    TeamConverter.prototype.from = function (obj) {
        return Rx.Observable.of({
            api_detail: (_a = {},
                _a[this.provider] = {
                    id: obj.id
                },
                _a),
            crestUrl: obj.crestUrl
        });
        var _a;
    };
    return TeamConverter;
}());
exports.TeamConverter = TeamConverter;
//# sourceMappingURL=converter.team.js.map