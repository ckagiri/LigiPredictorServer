import * as mongoose from 'mongoose';
import {ITeamDetail} from '../team/team.model';
const Schema = mongoose.Schema;

export interface IFixture {
  season: string;
  slug: string;
  round?: string;
  status: string;
  homeTeam: ITeamDetail;
  awayTeam: ITeamDetail
};

interface IFixtureModel extends IFixture, mongoose.Document { }

const teamDetailSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  code: {
    type: String
  }
}, {_id : false });

const fixtureSchema = new Schema({
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  round: {
    type: String
  },
  homeTeam: {
    type: teamDetailSchema
  },
  awayTeam: {
    type: teamDetailSchema
  },
  status: {
    type: String
  },
  result: {
    goalsHomeTeam: {
      type: Number
    },
    goalsAwayTeam: {
      type: Number
    }
  }
});

export const Fixture = mongoose.model<IFixtureModel>('Fixture', fixtureSchema);