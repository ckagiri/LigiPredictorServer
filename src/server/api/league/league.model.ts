import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  name: {type: String, required: true, trim: true}
});

export const League = mongoose.model('League', leagueSchema);