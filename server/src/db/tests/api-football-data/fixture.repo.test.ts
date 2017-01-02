process.env.NODE_ENV = 'test';

import * as Rx from 'rxjs';
import * as mongoose from 'mongoose';
import * as mocha from 'mocha';
import * as chai from 'chai';
import {config} from '../../../config/environment';
import * as db from '../../index';
import {ligiLeagueRepo, ligiSeasonRepo, ligiTeamRepo, teamRepo, fixtureRepo, seasonRepo} from '../../index';
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
let leic = {
  name: "Leicester City FC",
  shortName: "Leicester",
  code: "LEI",
  slug: "leicester_city",
  aliases: [] as any[]
}
let hull = {
  name: "Hull City FC",
  shortName: "Hull",
  code: "HUL",
  slug: "hull_city",
  aliases: [] as any[]
}

describe('Fixtures Repository test', () => {
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
    let league: any, season: any, team1: any, team2: any;
    Rx.Observable.zip(
      ligiLeagueRepo.insert(epl),
      ligiTeamRepo.insert(hull),
      ligiTeamRepo.insert(leic))
      .flatMap(function (arr: any[]) {
        league = arr[0];
        team1 = arr[1];
        team2 = arr[2];
        epl16.leagueId = league._id;

        return Rx.Observable.zip(
          ligiSeasonRepo.insert(epl16),
          teamRepo.findOneByNameAndUpdate(utils.pmTeams[1]),
          teamRepo.findOneByNameAndUpdate(utils.pmTeams[2]))
      })
      .flatMap(function (arr: any[]){
        season = arr[0];
        return seasonRepo.findOneByIdAndUpdate(season._id, {id: 426,
          caption: "Premier League 2016/17",
          currentMatchday: 4
        });
      })
      .flatMap(function(obj: any){
        let fixture = utils.fixtures[0]
        fixture.seasonId = 426
        return fixtureRepo.insert(fixture);
      })
      .subscribe(function (fixt: any) {
          expect(fixt.season.toString()).to.be.equal(season._id.toString());
          expect(fixt.homeTeam.name).to.be.equal(hull.shortName);
          expect(fixt.awayTeam.name).to.be.equal(leic.shortName);
          done();
      }, utils.errorHandler)
   });
});