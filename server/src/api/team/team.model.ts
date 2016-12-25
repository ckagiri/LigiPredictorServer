import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ITeam {
  name: string;
  code: string;
  slug: string;
  shortName: string;
  aliases: [string]
};

export interface ITeamDetail {
  name: string;
  slug: string;
  code?: string;
}

interface ITeamModel extends ITeam, mongoose.Document { }

const teamSchema = new Schema({
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
  code: {
    type: String
  },
  shortName: {
    type: String
  },
  aliases: {
    type: [String]
  }
});

export const Team = mongoose.model<ITeamModel>('Team', teamSchema);