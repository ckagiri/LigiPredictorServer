import {TeamRepo} from '../../db/repositories/repo.team';
import {SeasonRepo} from '../../db/repositories/repo.season';
import {FixtureRepo} from '../../db/repositories/repo.fixture';
import {TeamConverter} from '../../db/converters/api-football-data/converter.team';
import {SeasonConverter} from '../../db/converters/api-football-data/converter.season';
import {FixtureConverter} from '../../db/converters/api-football-data/converter.fixture';

export const seasonRepo = new SeasonRepo(new SeasonConverter());
export const teamRepo = new TeamRepo(new TeamConverter());
export const fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, teamRepo));
