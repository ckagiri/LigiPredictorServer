import TeamRepo from '../../db/repositories/repo.team';
import SeasonRepo from '../../db/repositories/repo.season';
import teamConverter from '../../db/converters/api-football-data/converter.team';
import seasonConverter from '../../db/converters/api-football-data/converter.season';

export const seasonRepo = new SeasonRepo(seasonConverter);
export const teamRepo = new TeamRepo(teamConverter);