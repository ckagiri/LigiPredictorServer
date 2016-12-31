import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ITeam {
  name: string;
  slug: string;
  shortName: string;
  code?: string;
  crestUrl?: string;
  aliases?: [string];
  api_detail?: any
};

export interface ITeamModel extends ITeam, mongoose.Document { }

const teamSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  shortName: {
    type: String
  },
  code: {
    type: String
  },
  aliases: {
    type: [String]
  },
  api_detail: {
    type: Schema.Types.Mixed
  },
  crestUrl: {
    type: String
  }
});

export const Team = mongoose.model<ITeamModel>('Team', teamSchema);