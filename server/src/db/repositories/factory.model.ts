import * as mongoose from 'mongoose';
import {Season, ISeasonModel} from '../../backend/api/season/season.model';
import {Team, ITeamModel} from '../../backend/api/team/team.model';

class ModelFactory {
  teamModel = Team;
  seasonModel = Season;
}

export default new ModelFactory();