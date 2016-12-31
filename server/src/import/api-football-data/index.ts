import {TeamRepo} from '../../db/repositories/repo.team';
import {SeasonRepo} from '../../db/repositories/repo.season';
import {TeamConverter} from '../../db/converters/api-football-data/converter.team';
import {SeasonConverter} from '../../db/converters/api-football-data/converter.season';

export const seasonRepo = new SeasonRepo(new SeasonConverter());
export const teamRepo = new TeamRepo(new TeamConverter());