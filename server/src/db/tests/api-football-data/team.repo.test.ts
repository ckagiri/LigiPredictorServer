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
let teamRepo = repoFactory.teamRepo;
let teamModel = modelFactory.teamModel;
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
    teamRepo.insert(utils.pmTeams[0])
      .flatMap(function (team: any) {
        console.log(team);
          return Rx.Observable.fromPromise(teamModel.findOne({_id: team._id}));
      })
      .subscribe(function (res: any) {
        console.log(res);
          expect(res.name).to.be.equal(utils.pmTeams[0].name);
          //expect(res.api_detail.id).to.be.equal(utils.pmTeams[0].id);
          done();
      }, utils.errorHandler);
  });
  
  it('id mapping', function (done) {
    let expected: any;
    let manu = {
      name: "Manchester United",
      shortName: "Man United",
      code: "MUN",
      slug: "man_united",
      aliases: ["Manchester United FC", "ManU", "ManUtd"]
    };
    let manu1 = {
      id: 66,
      name: "Manchester United FC",
      shortName: "ManU",
      squadMarketValue: "534,250,000 €",
      crestUrl: "http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg"
    };
    const {name, id} = manu1;
    teamRepo.findByNameAndUpdate({name, id}).then(() => done());
  });
});