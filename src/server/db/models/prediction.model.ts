import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IPrediction {
  user: string;
  fixture: string;
	choice: {
		goalsHomeTeam: number,
		goalsAwayTeam: number,
		isComputerGenerated: boolean
	}
};

export interface IPredictionModel extends IPrediction, mongoose.Document { }

const predictionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User required']
	},
	fixture: {
		type: Schema.Types.ObjectId,
		ref: 'Fixture',
		index: true,
		required: [true, 'Fixture required']
	},
	fixtureSlug: {
    type: String, 
    required: true, 
    trim: true
  },
	season: {
    type: Schema.Types.ObjectId,
    ref: 'Season',
		index: true,
  },
  round: {
    type: Number
  },
	choice: {
		goalsHomeTeam: {
			type: Number
		},
		goalsAwayTeam: {
			type: Number
		},
		isComputerGenerated: {
			type: Boolean,
			default: true
		}
	},
	timestamp :{
		type: Date,
		default: Date.now()
	},
	scorePoints: {
		matchOutcome: {
			type: Number
		}, 
		goalDifference: {
			type: Number
		}, 
		teamScore: {
			type: Number
		}, 
		matchScore: {
			type: Number
		}, 
		teamScoreOfTwoOrMore: {
			type: Number
		}, 
		plusOrMinusOneGoal: {
			type: Number
		}
	},
	points: {
		type: Number
	},
	goalDiff: {
		type: Number
	},
	hasJoker: {
		type: Boolean,
		default: false
	},
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'CANCELLED'],
  }
});

export const Prediction = mongoose.model<IPredictionModel>('Prediction', predictionSchema);
