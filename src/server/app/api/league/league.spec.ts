process.env.NODE_ENV = 'test';

import * as mocha from 'mocha';
import * as chai from 'chai';
import * as _ from 'lodash';
import * as request from 'supertest';
import {server as app} from '../../server';
import {League} from '../../../db/models/league.model';
import * as mongoose from 'mongoose';
const Promise = require('bluebird');
chai.should();

(<any>mongoose).Promise = Promise;

const clearAllLeagues = (done: any) => {
  League.remove({}).exec().then(() => {
    done();
  });
}

const newLeague = {name: 'English Premier League', slug: "english_premier_league"}

const getLeagues = () => {
  return new Promise((resolve: any) => {
    request(app)
      .get('/api/leagues')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any) => {
        if (err) { throw err; }
        resolve();
      });
  });
}

describe('League API', () => {
  before(done => clearAllLeagues(done));
  afterEach(done => clearAllLeagues(done));

  it('should add new league to the database', done => {
    getLeagues().then((leagues: any[]) => {
      console.log(leagues)
      });
	});
});