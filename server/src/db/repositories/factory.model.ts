import {Season} from '../../backend/api/season/season.model';
import {Team} from '../../backend/api/team/team.model';
import {League} from '../../backend/api/league/league.model';

class ModelFactory {
  teamModel = Team;
  seasonModel = Season;
  leagueModel = League;
}

export const modelFactory = new ModelFactory();