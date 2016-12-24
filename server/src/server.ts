process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as path from 'path';
import {routes} from './routes';
import {config} from './config/environment';
let favicon = require('serve-favicon');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

let clientPath = path.join(config.root, '../../client');
app.use(favicon(clientPath + '/favicon.ico'));
app.use(express.static(clientPath));

let renderIndex = (req: express.Request, res: express.Response) => {
  res.sendFile(clientPath + '/index.html');
}
app.get('/*', renderIndex);

mongoose.connect(config.mongo.uri, config.mongo.options);
const db = mongoose.connection;

const server: http.Server = app.listen(config.port, config.ip, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server listening at http://${host}:${port}`);

  db.on('error', (err: any) => {
    console.error(`ERROR CONNECTING TO MONGO: ${err}`);
    console.error(`Please make sure that ${config.mongo.uri} is running.`);
  });

  db.once('open', () => {
    console.info(`Connected to MongoDB: ${config.mongo.uri}`);
  });
});

export {server};