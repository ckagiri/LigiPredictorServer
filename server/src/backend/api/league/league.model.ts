import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ILeague {
  name: string;
  slug: string;
  code?: string;
  aliases: [string]
};

interface ILeagueModel extends ILeague, mongoose.Document { }

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true
  },  
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  code: {
    type: String
  },
  aliases: {
    type: [String]
  }
});

export const League = mongoose.model<ILeagueModel>('League', leagueSchema);