import * as mongoose from 'mongoose';

let connection: mongoose.Connection = null

export const init = (uri: string) => {
  mongoose.connect(uri);
  connection = mongoose.connection;
}

export const drop = () => {
  connection.db.dropDatabase();
}

export const close = () => {
  connection.close();
}