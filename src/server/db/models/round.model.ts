import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IRound {
    name: string;
    slug: string;
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
  }
});