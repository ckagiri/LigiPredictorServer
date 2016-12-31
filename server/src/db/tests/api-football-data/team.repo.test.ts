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

  xit('insert', function (done) {
    let manu = {
      name: "Manchester United",
      shortName: "Man United",
      code: "MUN",
      slug: "man_united",
      aliases: ["Manchester United FC", "ManU", "ManUtd"]
    };
    Rx.Observable.fromPromise(ligiTeamRepo.insert(manu))
      .flatMap(function (team: any) {
        return Rx.Observable.fromPromise(ligiTeamRepo.findOne({_id: team._id}));
      })
      .subscribe(function (res: any) {
          expect(res.name).to.be.equal(manu.name);
          done();
      }, utils.errorHandler);
  });
  
  xit('find one by name', function (done) {
    teamRepo.findOneByNameAndUpdate(utils.pmTeams[0])
      .then((res: any) => done());
  });

  it('id mapping', function (done) {
    let manu = {
      name: "Manchester United",
      shortName: "Man United",
      code: "MUN",
      slug: "man_united",
      aliases: ["Manchester United FC", "ManU", "ManUtd"]
    };
    let expected: any;
    Rx.Observable.fromPromise(ligiTeamRepo.insert(manu))
      .flatMap(function (team: any) {
        expected = team;
        //console.log(team);
        return ligiTeamRepo.idMapping(team.api_detail[ligiTeamRepo.provider].id)
      })
      .subscribe(function (actual: any) {
        console.log(actual);
        expect(expected._id.toString()).to.be.equal(actual.toString());
      }, utils.errorHandler, done);
  });
});