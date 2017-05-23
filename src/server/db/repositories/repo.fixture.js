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
var fixture_model_1 = require("../models/fixture.model");
var FixtureRepo = (function (_super) {
    __extends(FixtureRepo, _super);
    function FixtureRepo(converter) {
        return _super.call(this, fixture_model_1.Fixture, converter) || this;
    }
    FixtureRepo.prototype.findAllBySeason = function (seasonId) {
        return this.findAll({ 'season': seasonId });
    };
    FixtureRepo.prototype.findAllBySeasonRound = function (seasonId, round) {
        var query = { $and: [{ 'season': seasonId }, { round: round }] };
        return this.findAll(query);
    };
    return FixtureRepo;
}(repo_abstract_1.AbstractRepo));
exports.FixtureRepo = FixtureRepo;
//# sourceMappingURL=repo.fixture.js.map