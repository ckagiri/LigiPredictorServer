import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IRound {
	name: string;
	slug: string;
	startDate?: any;
	endDate?: any;
};

interface IRoundModel extends IRound, mongoose.Document { }

export const roundSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	}
});