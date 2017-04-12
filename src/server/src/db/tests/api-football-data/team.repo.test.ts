process.env.NODE_ENV = 'test';

import * as Rx from 'rxjs';
import * as mongoose from 'mongoose';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {config} from '../../../config/environment';
import * as db from '../../index';
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
let manu2 = {
  id: 66,
  name: "Manchester United",
  slug: "man_united",
  crestUrl: "http:manu.jpeg"
}

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

  xit('insert', function (done) {
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        return Rx.Observable.fromPromise(ligiTeamRepo.findOne({_id: team._id}));
      })
      .subscribe(function (res: any) {
        expect(res.name).to.be.equal(manu.name);
        done();
      }, utils.errorHandler);
  });
  
  xit('find one by name', function (done) {
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        return teamRepo.findOneByNameAndUpdate(utils.pmTeams[0]);
      })
      .subscribe(function (res: any) {
        expect(res.name).to.be.equal(manu.name);
        done();
      }, utils.errorHandler);
  });

  xit('find by name', function (done) {
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        let ateam = utils.pmTeams[0];
        return teamRepo.findByNameAndUpdate([ateam]);
      })
      .subscribe(function (res: any) {
        expect(res[0].name).to.be.equal(manu.name);
        done();
      }, utils.errorHandler);
  });

  it('find by slug and update', function (done) {
    let id: any;
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        let ateam = utils.pmTeams[0];
        id = team._id;
        return ligiTeamRepo.findOneBySlugAndUpdate(manu2);
      })
      .subscribe(function (res: any) {
        expect(res.name).to.be.equal(manu2.name);
        done();
      }, utils.errorHandler);
  });

  it('find by apidetail and update', function (done) {
    let id: number, crestUrl = 'http: manchester.jpeg';
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        let ateam = utils.pmTeams[0];
        id = team._id;
        return ligiTeamRepo.findBySlugAndUpdate([manu2]);
      })
      .flatMap(function(teams: any[]){
        return teamRepo.findOneByNameAndUpdate(manu2)
      })
      .flatMap(function(team: any){
        return teamRepo.findByApiIdAndUpdate(manu2.id, {crestUrl})
      })
      .subscribe(function (res: any) {
        expect(res.crestUrl).to.be.equal(crestUrl);
        done();
      }, utils.errorHandler);
  });

  xit('id mapping', function (done) {
    let expected: any;
    ligiTeamRepo.insert(manu)
      .flatMap(function (team: any) {
        expected = team;
        return ligiTeamRepo.idMapping(team.api_detail[ligiTeamRepo.provider].id)
      })
      .subscribe(function (actual: any) {
        expect(expected._id.toString()).to.be.equal(actual._id.toString());
      }, utils.errorHandler, done);
  });
});