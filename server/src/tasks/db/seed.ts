import * as async from 'async';
import * as mongoose from 'mongoose';
import {connect, drop, seed} from './common';

function seedCollections() {
  console.log('Seeding collections.');
  async.waterfall([connect, seed], function(err, results) {
    if (err) throw err;
    mongoose.connection.close();
  });
} 

seedCollections();