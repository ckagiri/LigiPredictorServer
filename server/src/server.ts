import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as path from 'path';
import {routes} from './routes';
let favicon = require('serve-favicon');

mongoose.connect("mongodb://localhost/ligi");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

let clientPath = path.join(__dirname, '../../client');
app.use(favicon(clientPath + '/favicon.ico'));
app.use(express.static(clientPath));

let renderIndex = (req: express.Request, res: express.Response) => {
  res.sendFile(clientPath + '/index.html');
}
app.get('/*', renderIndex);

const port = 8007;
const server: http.Server = app.listen(port, function() {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

export {server};