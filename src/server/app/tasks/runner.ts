import * as mongoose from 'mongoose';
import {config} from '../../config/environment';

export const toObjectId = (_id: string): mongoose.Types.ObjectId => {
  return mongoose.Types.ObjectId.createFromHexString(_id)
}

mongoose.connect(config.mongo.uri, config.mongo.options);