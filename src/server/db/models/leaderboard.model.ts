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
		ref: "League",
		index: true,
		required: true
	},
	round: {
		type: Number,
		index: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'User required'
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
