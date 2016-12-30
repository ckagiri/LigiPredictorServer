import * as mongoose from 'mongoose';

let connection: mongoose.Connection = null
let dropped = false;

export const init = (mongoUri: string, cb: any, options:any = {drop: false}) => {
  mongoose.connect(mongoUri, function (err) {
    if(options.drop) {
      mongoose.connection.db.dropDatabase(function (err) {
        cb(err);
      });
    } else {        
      cb(err);
    }
  });
}

export const drop = () => { 
  mongoose.connection.db.dropDatabase();
}

export const close = () => {
  mongoose.connection.close();
}