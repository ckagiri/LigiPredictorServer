import {Season} from '../../backend/api/season/season.model';
import {Team} from '../../backend/api/team/team.model';
import {League} from '../../backend/api/league/league.model';
import {Fixture} from '../../backend/api/fixture/fixture.model';

class ModelFactory {
  teamModel = Team;
  seasonModel = Season;
  leagueModel = League;
  fixtureModel = Fixture;
}

export const modelFactory = new ModelFactory();