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
import {seasonRepo, teamRepo, ligiTeamRepo} from '../../index';
let expect = chai.expect;
let utils = require('./test_utils');
const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;
let manu = {
  name: "Manchester United FC",
  shortName: "Man United",
  code: "MUN",
  slug: "man_united",
  aliases: ["Manchester United", "ManU", "ManUtd"]
};

describe('team repo', () => {
  before(done => {
    db.init(config.mongo.uri, done, {drop: true});
  });

  afterEach(done => {
    db.drop();
    done();
  });

  after(done => {
    db.close();
    done();
  });

  it('insert', function (done) {
    Rx.Observable.fromPromise(ligiTeamRepo.insert(manu))
      .flatMap(function (team: any) {
        return Rx.Observable.fromPromise(ligiTeamRepo.findOne({_id: team._id}));
      })
      .subscribe(function (res: any) {
          expect(res.name).to.be.equal(manu.name);
          done();
      }, utils.errorHandler);
  });
  
  it('find one by name', function (done) {
    Rx.Observable.fromPromise(ligiTeamRepo.insert(manu))
      .flatMap(function (team: any) {
        return Rx.Observable.fromPromise(teamRepo.findOneByNameAndUpdate(utils.pmTeams[0]));
      })
      .subscribe(function (res: any) {
        expect(res.name).to.be.equal(manu.name);
        done();
      }, utils.errorHandler);
  });

  it('id mapping', function (done) {
    let expected: any;
    Rx.Observable.fromPromise(ligiTeamRepo.insert(manu))
      .flatMap(function (team: any) {
        expected = team;
        return ligiTeamRepo.idMapping(team.api_detail[ligiTeamRepo.provider].id)
      })
      .subscribe(function (actual: any) {
        expect(expected._id.toString()).to.be.equal(actual.toString());
      }, utils.errorHandler, done);
  });
});