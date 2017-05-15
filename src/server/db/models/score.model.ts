import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IScore {
  user: string;
  fixture: string;
	prediction: string;
	points: number;
	pointsOld: number;
	posOld: number;
	posNew: number;
}

export interface IScoreModel extends IScore, mongoose.Document { }

const scoreSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'User required'
	},
	fixture: {
		ref: 'Fixture',
		index: true,
		required: 'Fixture required'
	},
	prediction: {
		type: Schema.Types.ObjectId,
		ref: 'Prediction',
		required: 'Prediction required'
	},
	points: {
		type: Number
	},
	pointsOld: {
		type: Number
	},
	posOld: {
		type: Number
	},
	posNew: {
		type: Number
	}
});

export const Score = mongoose.model<IScoreModel>('Score', scoreSchema);
