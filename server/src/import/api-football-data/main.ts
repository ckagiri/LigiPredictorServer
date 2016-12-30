process.env.NODE_ENV = 'development';

import {config} from '../../config/environment';
import * as db from '../../db';
import {Queue} from './queue';
import {MainJob} from './jobs/main.job';

db.init(config.mongo.uri, null, {drop: true});

let q = new Queue(50, 1000*60);

q.addJob(new MainJob());