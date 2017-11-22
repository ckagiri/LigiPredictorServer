"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var Rx = require("rxjs");
var _ = require("lodash");
var createIdToSeasonMap = function (seasons) {
    var map = {};
    for (var _i = 0, seasons_1 = seasons; _i < seasons_1.length; _i++) {
        var season = seasons_1[_i];
        map[season.id] = season;
    }
    return map;
};
var SeasonUpdateHandler = (function () {
    function SeasonUpdateHandler() {
    }
    SeasonUpdateHandler.prototype.handle = function (seasons) {
        var idToCompMap = createIdToSeasonMap(seasons);
        var apiIds = [];
        for (var _i = 0, seasons_2 = seasons; _i < seasons_2.length; _i++) {
            var season = seasons_2[_i];
            if (season.id !== 445) {
                continue;
            }
            apiIds.push(season.id);
        }
        common_1.seasonRepo.getByApiIds(apiIds)
            .flatMap(function (seasons) {
            return Rx.Observable.from(seasons);
        })
            .subscribe(function (season) {
            var apiDetailIdKey = common_1.seasonRepo.apiDetailIdKey();
            var compId = _.get(season, apiDetailIdKey, '');
            var newCurrentRound = idToCompMap[compId].currentMatchday;
            if (season.currentRound !== newCurrentRound) {
                Rx.Observable.fromPromise(common_1.seasonRepo.updateCurrentRound(season._id, newCurrentRound))
                    .subscribe(function () {
                    // create new leaderboard -> currentRound??
                    console.log("current round of " + season.name + " has updated");
                });
            }
            else {
                console.log("current round of " + season.name + " is updated already");
            }
        });
    };
    return SeasonUpdateHandler;
}());
exports.seasonUpdateHandler = new SeasonUpdateHandler();
//# sourceMappingURL=season-dbupdate.js.map