process.env.NODE_ENV = 'test';

import * as mongoose from 'mongoose';
import {config} from '../../config/environment';
import * as db from '../../db';
import {Queue} from './queue';
import {MainJob} from './jobs/main.job';
const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

db.init(config.mongo.uri);

let q = new Queue(50, 1000*60);

q.addJob(new MainJob());