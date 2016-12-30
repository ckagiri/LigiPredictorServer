import path = require('path');
import _ = require('lodash');

function requiredProcessEnv(name: any) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
let all = {
  env: requiredProcessEnv('NODE_ENV'),

  // Root path of server
  root: path.normalize(__dirname + '/../../../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

interface Configurations {
  env: string;
  root: string;
  port:number;
  mongo:{
    options: {
      db:{
          safe:boolean;
      }
    };
    uri: string;
  };
  ip:string;
  api_providers: {
    api_football_data: {
      name: string,
      apiKey: string
    },
    sports_open_data: {
      name: string,
      apiKey: string
    }
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
export const config: Configurations = _.merge(
  all,
  require('./' + process.env.NODE_ENV) || {}
);
