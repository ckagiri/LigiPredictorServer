import {config} from '../../config/environment';
import Client from '../../soccer-api/api-football-data';
import {LeagueRepo, SeasonRepo, TeamRepo, FixtureRepo, PredictionRepo, UserRepo, LeaderboardRepo, UserScoreRepo} from '../../db/repositories';
import {LeagueConverter, SeasonConverter, TeamConverter, FixtureConverter} from '../../db/converters/ligi-predictor';

export const leagueRepo = new LeagueRepo(new LeagueConverter())
export const seasonRepo = new SeasonRepo(new SeasonConverter(leagueRepo));
export const teamRepo = new TeamRepo(new TeamConverter())
export const fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, TeamRepo))
export const predictionRepo = new PredictionRepo();
export const userRepo = new UserRepo();
export const leaderboardRepo = new LeaderboardRepo();
export const userScoreRepo = new UserScoreRepo();

export const client = new Client(config.api_providers.api_football_data.apiKey);