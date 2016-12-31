process.env.NODE_ENV = 'test';

import * as Rx from 'rxjs';
import * as mongoose from 'mongoose';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {config} from '../../../config/environment';
import * as db from '../../index';
import {ligiLeagueRepo, ligiSeasonRepo, seasonRepo} from '../../index';
let expect = chai.expect;
let utils = require('./test_utils');
const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

let epl = {
  name: "English Premier League",
  code: "PL",
  slug: "premier-league"
}
let epl16 = {
  name: "2016-2017",
  slug: "16-17",
  year: "2016",
  leagueId: null as string
}

describe('seasonRepo repo', () => {
  before(done => {
    db.init(config.mongo.uri, done, {drop: true});
  });

  afterEach(done => {
   // db.drop();
    done();
  });

  after(done => {
    db.close();
    done();
  });

  it('insert', function (done) {
    Rx.Observable.fromPromise(ligiLeagueRepo.insert(epl))
      .flatMap(function (league: any) {
        epl16.leagueId = league._id;
        return Rx.Observable.fromPromise(ligiSeasonRepo.insert(epl16));
      })
      .subscribe(function (res: any) {
        console.log(res)
        done();
      }, utils.errorHandler);
   });
});