process.env.NODE_ENV = 'test';

import * as Rx from 'rxjs';
import * as mongoose from 'mongoose';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {config} from '../../../config/environment';
import * as db from '../../index';
import RepoFactory from '../../repositories/factory.repo';
import modelFactory from '../../repositories/factory.model';
import {api_data} from '../../providers';
import {seasonRepo, teamRepo, defaultTeamRepo} from '../../index';
let expect = chai.expect;
let utils = require('./test_utils');
const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

describe('team repo', () => {
  before(done => {
    db.init(config.mongo.uri, done, {drop: true});
  });

  afterEach(done => {
    //db.drop();
    done();
  });

  after(done => {
    db.close();
    done();
  });

  it('insert', function (done) {
    let manu = {
      name: "Manchester United",
      shortName: "Man United",
      code: "MUN",
      slug: "man_united",
      aliases: ["Manchester United FC", "ManU", "ManUtd"]
    };
    defaultTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        console.log(team);
        return Rx.Observable.fromPromise(defaultTeamRepo.findOne({_id: team._id}));
      })
      .subscribe(function (res: any) {
        console.log(res);
          expect(res.name).to.be.equal(manu.name);
          done();
      }, utils.errorHandler);
  });
  
  it('id mapping', function (done) {
    let expected: any;
    teamRepo.findByNameAndUpdate(utils.pmTeams[0].name).then((res: any) => done());
  });
});