import * as mocha from 'mocha';
import * as chai from 'chai';
import * as _ from 'lodash';
import * as request from 'supertest';
import {server as app} from '../../../server';
import {League} from './league.model';
import * as mongoose from 'mongoose';
const Promise = require('bluebird');
chai.should();

(<any>mongoose).Promise = Promise;

const clearAllLeagues = (done: any) => {
  League.remove({}).exec().then(() => {
    done();
  });
}

const newLeague = {name: 'English Premier League'}

const addLeague = (league: any) => {
  return new Promise((resolve: any) => {
    request(app)
      .post('/api/leagues')
      .send(league)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: any) => {
        if (err) { throw err.message; }
        resolve();
      });
  });
}

describe('League API', () => {
  before(done => clearAllLeagues(done));
  afterEach(done => clearAllLeagues(done));

  it('should add new league to the database', done => {
    addLeague(newLeague).then((checkDatabase: any) => {
      League.find({}, (err, leagues) => {
        if (err) { return done(err); }
        leagues.should.have.length(1);
        done();
      });
    });
  });
});