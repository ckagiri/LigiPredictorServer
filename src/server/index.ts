import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import {routes} from './routes'

mongoose.connect("mongodb://localhost/ligi");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

const port = 8007;
let server = app.listen(8007, function() {
  console.log('Server running at http://127.0.0.1:8007/');
});