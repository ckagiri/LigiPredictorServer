"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var DefaultTeamConverter = (function () {
    function DefaultTeamConverter() {
        this.provider = 'LIGI';
    }
    DefaultTeamConverter.prototype.from = function (obj) {
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
    return DefaultTeamConverter;
}());
exports.DefaultTeamConverter = DefaultTeamConverter;
//# sourceMappingURL=default-converter.team.js.map