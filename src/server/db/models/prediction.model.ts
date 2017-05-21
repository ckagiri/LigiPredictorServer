import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IPrediction {
  user: string;
  fixture: string;
	choice: {
		goalsHomeTeam: number,
		goalsAwayTeam: number
	}
};

export interface IPredictionModel extends IPrediction, mongoose.Document { }

const predictionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'User required'
	},
	fixture: {
		type: Schema.Types.ObjectId,
		ref: 'Fixture',
		index: true,
		required: 'Fixture required'
	},
	choice: {
		goalsHomeTeam: {
			type: Number
		},
		goalsAwayTeam: {
			type: Number
		}
	},
	timestamp :{
		type: Date,
		default: Date.now()
	}
});

export const Prediction = mongoose.model<IPredictionModel>('Prediction', predictionSchema);
