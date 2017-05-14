import * as mongoose from 'mongoose';
import {IRound, roundSchema} from './round.model';
const Schema = mongoose.Schema;

export interface ISeason {
  name: string;
  slug: string;
  aliases: [string];
  league: string;
  caption: string;
  rounds: [IRound];
	numberOfRounds?: number,
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
    type: [roundSchema]
  },
	teams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Teams"
	}],
  currentRound: {
    type: Number
  },
	numberOfRounds: {
		type: Number
	},
	numberOfTeams: {
		type: Number
	},
	numberOfGames: {
		type: Number
	},
  api_detail: {
    type: Schema.Types.Mixed
  }
});

export const Season = mongoose.model<ISeasonModel>('Season', seasonSchema);