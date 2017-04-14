"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var repo_team_1 = require("../../db/repositories/repo.team");
var repo_season_1 = require("../../db/repositories/repo.season");
var repo_fixture_1 = require("../../db/repositories/repo.fixture");
var converter_team_1 = require("../../db/converters/api-football-data/converter.team");
var converter_season_1 = require("../../db/converters/api-football-data/converter.season");
var converter_fixture_1 = require("../../db/converters/api-football-data/converter.fixture");
exports.seasonRepo = new repo_season_1.SeasonRepo(new converter_season_1.SeasonConverter());
exports.teamRepo = new repo_team_1.TeamRepo(new converter_team_1.TeamConverter());
exports.fixtureRepo = new repo_fixture_1.FixtureRepo(new converter_fixture_1.FixtureConverter(exports.seasonRepo, exports.teamRepo));
//# sourceMappingURL=index.js.map