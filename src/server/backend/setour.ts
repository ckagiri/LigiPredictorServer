import * as express from 'express';

const router = express.Router();
import { send404, notFoundMiddleware } from './utils/notfound'; 
import data = require('./data');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', notFoundMiddleware);

module.exports = router;

function getPeople(req: express.Request, res: express.Response, next: any) {
	res.status(200).send(data.getPeople());
}

function getPerson(req: express.Request, res: express.Response, next: any) {
	var id = +req.params.id;
	var person = data.getPeople().filter(function(p) {
			return p.id === id;
	})[0];

	if (person) {
			res.status(200).send(person);
	} else {
			send404(req, res, 'person ' + id + ' not found');
	}
}
