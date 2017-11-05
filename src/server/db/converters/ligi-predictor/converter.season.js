"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var SeasonConverter = (function () {
    function SeasonConverter(leagueRepo) {
        this.leagueRepo = leagueRepo;
        this.provider = 'LIGI';
    }
    SeasonConverter.prototype.from = function (obj) {
        var _this = this;
        return Rx.Observable.fromPromise(this.leagueRepo.idMapping(obj.leagueId))
            .flatMap(function (league) {
            return Rx.Observable.of({
                api_detail: (_a = {},
                    _a[_this.provider] = {
                        id: obj.slug
                    },
                    _a),
                league: {
                    id: league._id,
                    name: league.name,
                    slug: league.slug
                },
                name: obj.name,
                slug: obj.slug,
                year: obj.year
            });
            var _a;
        });
    };
    return SeasonConverter;
}());
exports.SeasonConverter = SeasonConverter;
//# sourceMappingURL=converter.season.js.map