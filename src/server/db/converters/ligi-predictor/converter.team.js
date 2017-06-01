"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var TeamConverter = (function () {
    function TeamConverter() {
        this.provider = 'LIGI';
    }
    TeamConverter.prototype.from = function (obj) {
        return Rx.Observable.of({
            api_detail: (_a = {},
                _a[this.provider] = {
                    id: obj.slug
                },
                _a),
            name: obj.name,
            shortName: obj.shortName,
            code: obj.code,
            slug: obj.slug,
            aliases: obj.aliases
        });
        var _a;
    };
    return TeamConverter;
}());
exports.TeamConverter = TeamConverter;
//# sourceMappingURL=converter.team.js.map