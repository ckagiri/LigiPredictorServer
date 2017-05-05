import * as mongoose from 'mongoose';
import {TeamRepo} from './repositories/repo.team';
import {LeagueRepo} from './repositories/repo.league';
import {SeasonRepo} from './repositories/repo.season';
import {FixtureRepo} from './repositories/repo.fixture';
import {LeagueConverter as DefaultLeagueConverter} from './converters/ligi-predictor/converter.league';
import {SeasonConverter as DefaultSeasonConverter} from './converters/ligi-predictor/converter.season';
import {TeamConverter as DefaultTeamConverter} from './converters/ligi-predictor/converter.team';
import {FixtureConverter} from './converters/api-football-data/converter.fixture';
import {TeamConverter} from './converters/api-football-data/converter.team';
import {SeasonConverter} from './converters/api-football-data/converter.season';

let connection: mongoose.Connection = null
let dropped = false;

export const init = (mongoUri: string, cb?: any, options:any = {drop: false}) => {
  cb = cb || function() {}
  mongoose.connect(mongoUri, err => {
    if(options.drop) {
      mongoose.connection.db.dropDatabase(function (err) {
        cb(err);
      });
    } else {        
      cb(err);
    }
  });
}

export const drop = () => { 
  mongoose.connection.db.dropDatabase();
}

export const close = () => {
  mongoose.connection.close();
}

export const seasonRepo = new SeasonRepo(new SeasonConverter());
export const teamRepo = new TeamRepo(new TeamConverter());
export const fixtureRepo = new FixtureRepo(new FixtureConverter(seasonRepo, teamRepo));

export const ligiLeagueRepo = new LeagueRepo(new DefaultLeagueConverter());
export const ligiSeasonRepo = new SeasonRepo(new DefaultSeasonConverter(ligiLeagueRepo))
export const ligiTeamRepo = new TeamRepo(new DefaultTeamConverter())