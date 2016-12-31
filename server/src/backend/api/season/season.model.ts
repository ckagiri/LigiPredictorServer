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
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      index: true,
      required: true
    }
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
  year: {
    type: String,
    required: true
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