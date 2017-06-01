import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUserScore {
	leaderboard: string;
	user: string;
	predictions: [string];
	points: number;
	goalDiff: number;
	pointsOld?: number;
	goalDiffOld?: number;
	posOld?: number;
	posNew?: number;
}

export interface IUserScoreModel extends IUserScore, mongoose.Document { }

const userScoreSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: 'User required'
	},	
	leaderboard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Leaderboard'
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

export const UserScore = mongoose.model<IUserScoreModel>('UserScore', userScoreSchema);
