import * as mongoose from 'mongoose';
import TeamRepo from './repositories/repo.team';
import SeasonRepo from './repositories/repo.season';
import teamConverter from './converters/api-football-data/converter.team';
import seasonConverter from './converters/api-football-data/converter.season';
import ligiTeamConverter from './converters/default-converter.team';

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

export const seasonRepo = new SeasonRepo(seasonConverter);
export const teamRepo = new TeamRepo(teamConverter);
export const ligiTeamRepo = new TeamRepo(ligiTeamConverter)