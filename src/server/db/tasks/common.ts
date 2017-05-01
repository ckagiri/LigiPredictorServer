process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as async from 'async';
import * as mongoose from 'mongoose';
import dbModels from '../../db/models';
import {config} from '../../config/environment';

const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

const seedData = require('../../config/seed-data');
const seeder = require('mongoose-seeder');

export const connect = (callback: any) => {
  mongoose.connect(config.mongo.uri);
  mongoose.connection.on('open', callback.bind(callback, null, dbModels));
};

export const drop = (models: any[], callback: any) => {
  async.map(models, function(model: any, callback: any) {
    model.collection.remove(callback);
  }, function() {
    callback(null, models);
  });
};

export const seed = (models: any[], callback: any) => {
  seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
    .then(function(dbData: any){
      callback();      
    }).catch(function(err: any){
      console.log(err);
      callback(err)
    });
}