import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ILeaderboard { 
  season: string;
  round: number;
  group: string;
  status: string;
  userCount: number;
  lastStatusUpdate: any;
}

export interface ILeaderboardModel extends ILeaderboard, mongoose.Document { }

const leaderboardSchema = new Schema({
  season: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Season"
  },
  round: {
		type: Number
  },
  status: {
    type: String,
    enum: ['Refreshed', 'UpdatingScores', 'UpdatingRankings'],
    default: 'Refreshed'
  },
  userCount: {
    type: Number
  },
  lastStatusUpdate: {
    type: String
  }
});

export const Leaderboard = mongoose.model<ILeaderboardModel>('Leaderboard', leaderboardSchema);