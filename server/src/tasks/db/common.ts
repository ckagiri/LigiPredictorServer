import * as async from 'async';
import * as mongoose from 'mongoose';
import dataModels from '../../api/models';
import {config} from '../../config/environment';
import {seedData} from '../../config/seed-data';

const seeder = require('mongoose-seeder');

export const connect = (callback: any) => {
  mongoose.connect(config.mongo.uri);
  mongoose.connection.on('open', callback.bind(callback, null, dataModels));
};

export const drop = (models: any[], callback: any) => {
  async.map(models, function(model: any, callback: any) {
    model.collection.remove(callback);
  }, function() {
    callback(null, models);
  });
};

export const seed = (models: any[], callback: any) => {
  console.log(callback)
  seeder.seed(seedData, { dropCollections: false })
    .then(function(dbData: any){
      callback();      
    }).catch(function(err: any){
      console.log(err);
      callback(err)
    });
}