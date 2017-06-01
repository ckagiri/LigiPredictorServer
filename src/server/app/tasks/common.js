"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../config/environment");
var api_football_data_1 = require("../../soccer-api/api-football-data");
var repositories_1 = require("../../db/repositories");
var ligi_predictor_1 = require("../../db/converters/ligi-predictor");
exports.leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
exports.seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(exports.leagueRepo));
exports.teamRepo = new repositories_1.TeamRepo(new ligi_predictor_1.TeamConverter());
exports.fixtureRepo = new repositories_1.FixtureRepo(new ligi_predictor_1.FixtureConverter(exports.seasonRepo, repositories_1.TeamRepo));
exports.predictionRepo = new repositories_1.PredictionRepo();
exports.userRepo = new repositories_1.UserRepo();
exports.leaderboardRepo = new repositories_1.LeaderboardRepo();
exports.userScoreRepo = new repositories_1.UserScoreRepo();
exports.client = new api_football_data_1.default(environment_1.config.api_providers.api_football_data.apiKey);
//# sourceMappingURL=common.js.map