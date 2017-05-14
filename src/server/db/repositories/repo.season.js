"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var repo_abstract_1 = require("./repo.abstract");
var season_model_1 = require("../models/season.model");
var Rx = require("rxjs");
var SeasonRepo = (function (_super) {
    __extends(SeasonRepo, _super);
    function SeasonRepo(converter) {
        return _super.call(this, season_model_1.Season, converter) || this;
    }
    SeasonRepo.prototype.findByYear = function (year) {
        return this.findAll({ year: year });
    };
    SeasonRepo.prototype.findByLeague = function (leagueId) {
        return this.findAll({ leagueId: leagueId });
    };
    SeasonRepo.prototype.getTeams = function (seasonId) {
        return Rx.Observable.fromPromise(this.model.find({ seasonId: seasonId }).populate('teams').exec(function (err, season) {
            if (err)
                throw ('Bad');
            if (!season)
                throw (new Error('Failed to load Fixture ' + seasonId));
            return season.teams;
        }));
    };
    return SeasonRepo;
}(repo_abstract_1.AbstractRepo));
exports.SeasonRepo = SeasonRepo;
//# sourceMappingURL=repo.season.js.map