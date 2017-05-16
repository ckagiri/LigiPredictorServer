import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {Prediction} from '../models/prediction.model';
const Promise = require('bluebird'); 

export class PredictionRepo {
  findOrCreateDefault(userId: string, fixtureId: string) {
      return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {
        var query = {$and: [{'user': userId}, {'fixture': fixtureId}]}
				Prediction.findOne(query)
					.lean()
					.exec(function(err: any, prediction: any) {
						if (err) reject(err);
						if (!prediction) reject(new Error('Failed to find or create prediction'));
						return resolve(prediction);
					});
		}));
  }
}