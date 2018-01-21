import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUserScore {
	leaderboard: string;
	user: string;
	predictions: [string];
	fixtures: [string];
	points: number;
  goalDiff: number;
  goalDiffPoints: number;
	pointsExcJoker?: number;
	goalDiffExcJoker?: number;
	pointsOld?: number;
  goalDiffOld?: number;
  goalDiffPointsOld?: number;
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
	fixtures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Fixture"
	}],
	predictions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Prediction"
	}],
	points: {
		type: Number
	},
	pointsExcJoker: {
		type: Number
	},
	pointsOld: {
		type: Number
	},
	goalDiff: {
		type: Number
	},
	goalDiffExcJoker: {
		type: Number
	},
	goalDiffOld: {
		type: Number
  },
  goalDiffPoints: {
		type: Number
	},
  goalDiffPointsOld: {
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
