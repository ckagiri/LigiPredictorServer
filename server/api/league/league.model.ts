import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ILeague {
    name: string;
};

interface ILeagueModel extends ILeague, mongoose.Document { }


const leagueSchema = new Schema({
  name: {type: String, required: true, trim: true}
});

export const League = mongoose.model<ILeagueModel>('League', leagueSchema);