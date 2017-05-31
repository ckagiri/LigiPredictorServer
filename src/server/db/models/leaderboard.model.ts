import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ILeaderboard {
	season: string;
	round?: number;
  user: string;
	predictions: [string];
	points: number;
	pointsOld: number;
	goalDiff: number;
	goalDiffOld: number;
	posOld: number;
	posNew: number;
}

export interface ILeaderboardModel extends ILeaderboard, mongoose.Document { }

const leaderboardSchema = new Schema({
	season: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Season",
		required: true
	},
	round: {
		type: Number,
		index: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: 'User required'
	},	
	boardInfo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BoardInfo'
	},
	predictions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Prediction"
	}],
	points: {
		type: Number
	},
	pointsOld: {
		type: Number
	},
	goalDiff: {
		type: Number
	},
	goalDiffOld: {
		type: Number
	},
	posOld: {
		type: Number
	},
	posNew: {
		type: Number
	}
});

export const Leaderboard = mongoose.model<ILeaderboardModel>('Leaderboard', leaderboardSchema);
