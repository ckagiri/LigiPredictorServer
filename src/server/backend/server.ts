process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as path from 'path';
import { send404 } from './utils/notfound';  
import {routes as authRoutes} from './authRoutes';
import {routes as apiRoutes} from './apiRoutes';
import {config} from '../config/environment';

const app = express();

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(function(req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        var query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


console.log('About to crank up node');
console.log('PORT=' + config.port);
console.log('NODE_ENV=' + config.env);

switch (config.env) {
    case 'build':
		case 'production':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', (req, res, next) => {
            send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', (req, res, next) => {
            send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

// mongoose.connect(config.mongo.uri, config.mongo.options);
// const db = mongoose.connection;

const server: http.Server = app.listen(config.port, config.ip, () => {
	const host = server.address().address;
  const port = server.address().port;
  console.log(`Express Server listening at http://${host}:${port}`);
	console.log('env = ' + app.get('env') +
		'\n__dirname = ' + __dirname +
		'\nprocess.cwd = ' + process.cwd());

	// db.on('error', (err: any) => {
  //   console.error(`ERROR CONNECTING TO MONGO: ${err}`);
  //   console.error(`Please make sure that ${config.mongo.uri} is running.`);
  // });

  // db.once('open', () => {
  //   console.info(`Connected to MongoDB: ${config.mongo.uri}`);
  // });
});

export {server};