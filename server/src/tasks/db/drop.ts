import * as async from 'async';
import * as mongoose from 'mongoose';
import {connect, drop, seed} from './common';

function dropCollections() {
  console.log('Dropping collections.');
  async.waterfall([connect, drop], function(err: any, results: any) {
    console.log('results', results);
    if (err) throw err;
    mongoose.connection.close();
  });
}

dropCollections();