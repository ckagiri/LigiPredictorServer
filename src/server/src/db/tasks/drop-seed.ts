import * as async from 'async';
import * as mongoose from 'mongoose';
import {connect, drop, seed} from './common';

function dropSeedCollections() {
  console.log('Dropping and Seeding collections.');
  async.waterfall([connect, drop, seed], function(err, results) {
    if (err) throw err;
    mongoose.connection.close();
  });
} 

dropSeedCollections();