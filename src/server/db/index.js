"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var repo_team_1 = require("./repositories/repo.team");
var repo_league_1 = require("./repositories/repo.league");
var repo_season_1 = require("./repositories/repo.season");
var repo_fixture_1 = require("./repositories/repo.fixture");
var converter_league_1 = require("./converters/ligi-predictor/converter.league");
var converter_season_1 = require("./converters/ligi-predictor/converter.season");
var converter_team_1 = require("./converters/ligi-predictor/converter.team");
var converter_fixture_1 = require("./converters/api-football-data/converter.fixture");
var converter_team_2 = require("./converters/api-football-data/converter.team");
var converter_season_2 = require("./converters/api-football-data/converter.season");
var connection = null;
var dropped = false;
exports.init = function (mongoUri, cb, options) {
    if (options === void 0) { options = { drop: false }; }
    cb = cb || function () { };
    mongoose.connect(mongoUri, function (err) {
        if (options.drop) {
            mongoose.connection.db.dropDatabase(function (err) {
                cb(err);
            });
        }
        else {
            cb(err);
        }
    });
};
exports.drop = function () {
    mongoose.connection.db.dropDatabase();
};
exports.close = function () {
    mongoose.connection.close();
};
exports.seasonRepo = new repo_season_1.SeasonRepo(new converter_season_2.SeasonConverter());
exports.teamRepo = new repo_team_1.TeamRepo(new converter_team_2.TeamConverter());
exports.fixtureRepo = new repo_fixture_1.FixtureRepo(new converter_fixture_1.FixtureConverter(exports.seasonRepo, exports.teamRepo));
exports.ligiLeagueRepo = new repo_league_1.LeagueRepo(new converter_league_1.LeagueConverter());
exports.ligiSeasonRepo = new repo_season_1.SeasonRepo(new converter_season_1.SeasonConverter(exports.ligiLeagueRepo));
exports.ligiTeamRepo = new repo_team_1.TeamRepo(new converter_team_1.TeamConverter());
//# sourceMappingURL=index.js.map