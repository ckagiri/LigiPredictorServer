import * as mongoose from 'mongoose';
import {IMatchRound, matchRoundSchema} from './matchround.model';
const Schema = mongoose.Schema;

export interface ISeason {
  name: string;
  slug: string;
  aliases: [string];
  league: string;
  rounds: [IMatchRound]
};

interface ISeasonModel extends ISeason, mongoose.Document { }

const seasonSchema = new Schema({
  league: {
    type: Schema.Types.ObjectId,
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
  },
  rounds: {
    type: [matchRoundSchema]
  }
});

export const Season = mongoose.model<ISeasonModel>('Season', seasonSchema);