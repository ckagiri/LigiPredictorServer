import * as mongoose from 'mongoose';
import {IMatchRound, matchRoundSchema} from './matchround.model';
const Schema = mongoose.Schema;

export interface ISeason {
  name: string;
  slug: string;
  aliases: [string];
  league: string;
  rounds: [IMatchRound]
  currentRound: string
};

export interface ISeasonModel extends ISeason, mongoose.Document { }

const seasonSchema = new Schema({
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League'
  },
  name: {
    type: String, 
    required: true
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
  },
  currentRound: {
    type: String
  }
});

export const Season = mongoose.model<ISeasonModel>('Season', seasonSchema);