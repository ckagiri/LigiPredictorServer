"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var season_model_1 = require("../../backend/api/season/season.model");
var team_model_1 = require("../../backend/api/team/team.model");
var league_model_1 = require("../../backend/api/league/league.model");
var fixture_model_1 = require("../../backend/api/fixture/fixture.model");
var ModelFactory = (function () {
    function ModelFactory() {
        this.teamModel = team_model_1.Team;
        this.seasonModel = season_model_1.Season;
        this.leagueModel = league_model_1.League;
        this.fixtureModel = fixture_model_1.Fixture;
    }
    return ModelFactory;
}());
exports.modelFactory = new ModelFactory();
//# sourceMappingURL=factory.model.js.map