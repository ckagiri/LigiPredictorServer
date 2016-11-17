import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = app.listen(8007, 'localhost', () => {
  const {address, port} = server.address();
  console.log('Listening on http://localhost:' + port);
});