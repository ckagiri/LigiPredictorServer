import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IMatchRound {
    name: string;
    slug: string;
};

interface IMatchRoundModel extends IMatchRound, mongoose.Document { }

export const matchRoundSchema = new Schema({
  name: {type: String, required: true, trim: true},
  slug: {type: String, required: true, trim: true}
});