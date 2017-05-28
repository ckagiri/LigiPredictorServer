import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IBoardInfo { 
  season: string;
  round: number;
  group: string;
  status: string;
  userCount: number;
  lastStatusUpdate: any;
}

export interface IBoardInfoModel extends IBoardInfo, mongoose.Document { }

const boardInfoSchema = new Schema({
  season: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Season"
  },
  round: {
		type: Number
  },
  status: {
    type: String,
  },
  userCount: {
    type: Number
  },
  lastStatusUpdate: {
    type: String
  }
});

export const BoardInfo = mongoose.model<IBoardInfoModel>('BoardInfo', boardInfoSchema);