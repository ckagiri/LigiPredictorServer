"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs");
var environment_1 = require("../../../config/environment");
var provider = environment_1.config.api_providers.api_football_data.name;
var FixtureConverter = (function () {
    function FixtureConverter(seasonRepo, teamRepo) {
        this.seasonRepo = seasonRepo;
        this.teamRepo = teamRepo;
        this.provider = 'LIGI';
    }
    FixtureConverter.prototype.from = function (obj) {
        var _this = this;
        return Rx.Observable.zip(Rx.Observable.fromPromise(this.seasonRepo.idMapping(obj.seasonId)), Rx.Observable.fromPromise(this.teamRepo.nameMapping(obj.homeTeamName)), Rx.Observable.fromPromise(this.teamRepo.nameMapping(obj.awayTeamName)), function (season, homeTeam, awayTeam) {
            return {
                api_detail: (_a = {},
                    _a[_this.provider] = {
                        id: obj.id
                    },
                    _a),
                season: season._id,
                round: obj.matchday,
                status: obj.status,
                homeTeam: {
                    slug: homeTeam.slug,
                    name: homeTeam.name,
                    id: homeTeam._id,
                    crestUrl: homeTeam.crestUrl
                },
                awayTeam: {
                    slug: awayTeam.slug,
                    name: awayTeam.name,
                    id: awayTeam._id,
                    crestUrl: awayTeam.crestUrl
                },
                slug: homeTeam.slug + "-" + awayTeam.slug,
                result: {
                    goalsHomeTeam: obj.result.goalsHomeTeam,
                    goalsAwayTeam: obj.result.goalsAwayTeam
                },
                odds: obj.odds
            };
            var _a;
        });
    };
    return FixtureConverter;
}());
exports.FixtureConverter = FixtureConverter;
//# sourceMappingURL=converter.fixture.js.map