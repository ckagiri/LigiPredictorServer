import * as mongoose from 'mongoose';
import {IMatchRound, matchRoundSchema} from './matchround.model';
const Schema = mongoose.Schema;

export interface ISeason {
  name: string;
  slug: string;
  aliases: [string];
  league: string;
  caption: string;
  rounds: [IMatchRound]
  currentRound?: number,
  api_detail?: any
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
  caption: {
    type: String
  },
  aliases: {
    type: [String]
  },
  rounds: {
    type: [matchRoundSchema]
  },
  currentRound: {
    type: Number
  },
  api_detail: {
    type: Schema.Types.Mixed
  }
});

export const Season = mongoose.model<ISeasonModel>('Season', seasonSchema);