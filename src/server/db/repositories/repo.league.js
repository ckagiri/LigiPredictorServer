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
var league_model_1 = require("../models/league.model");
var LeagueRepo = (function (_super) {
    __extends(LeagueRepo, _super);
    function LeagueRepo(converter) {
        return _super.call(this, league_model_1.League, converter) || this;
    }
    return LeagueRepo;
}(repo_abstract_1.AbstractRepo));
exports.LeagueRepo = LeagueRepo;
//# sourceMappingURL=repo.league.js.map