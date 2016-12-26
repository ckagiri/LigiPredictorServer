import * as mongoose from 'mongoose';
import {Team, ITeamModel} from '../../backend/api/team/team.model';

class ModelFactory {
  teamModel: mongoose.Model<ITeamModel>;

  constructor() {
    this.teamModel = Team;
  }
}

export default new ModelFactory();