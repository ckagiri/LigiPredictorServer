"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var DefaultLeagueConverter = (function () {
    function DefaultLeagueConverter() {
        this.provider = 'LIGI';
    }
    DefaultLeagueConverter.prototype.from = function (obj) {
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
    return DefaultLeagueConverter;
}());
exports.DefaultLeagueConverter = DefaultLeagueConverter;
//# sourceMappingURL=default-converter.league.js.map