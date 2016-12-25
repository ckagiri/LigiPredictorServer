import * as mongoose from 'mongoose';
import {ITeam} from '../team/team.model';
const Schema = mongoose.Schema;

export interface ISeason {
    name: string;
    slug: string;
    aliases: [string];
    league: string;
};

interface ISeasonModel extends ISeason, mongoose.Document { }

const seasonSchema = new Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  },
  name: {
    type: String, 
    required: true, 
    trim: true
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  aliases: {
    type: [String]
  }
});

export const Season = mongoose.model<ISeasonModel>('Season', seasonSchema);