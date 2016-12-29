process.env.NODE_ENV = 'test';

import * as Rx from 'rxjs';
import * as mongoose from 'mongoose';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {config} from '../../../config/environment';
import * as db from '../../index';
import repoFactory from '../../repositories/factory.repo';
import modelFactory from '../../repositories/factory.model';
import {api_data} from '../../providers';

let expect = chai.expect;
let teamRepo: any = null;
let teamModel: any = null;
let utils = require('./test_utils');
const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

describe('team repo', () => {
  before(done => {
    db.init(config.mongo.uri);
    teamRepo = repoFactory.teamRepo;
    teamModel = modelFactory.teamModel;
    done();
  });

  afterEach(done => {
    db.drop();
    done();
  });

  after(done => {
    db.close();
    done();
  });

  it('should insert', done => {
    teamRepo.insert(utils.pmTeams[0])
      .flatMap((team: any) => {
        return Rx.Observable.fromPromise(teamModel.findOne({_id: team._id}));
      })
      .subscribe((res: any) => {
        expect(res.name).to.be.equal(utils.pmTeams[0].name);
        expect(res.api_detail[api_data].id).to.be.equal(utils.pmTeams[0].id);
          done();
    }, utils.errorHandler);
  })
});