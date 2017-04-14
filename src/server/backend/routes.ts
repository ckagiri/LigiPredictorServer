import {Router} from 'express';
import {leagueRouter} from './api/league/league.route';
import { send404, notFoundMiddleware } from './utils/notfound'; 
import data = require('./data');

const router = Router();

router.get('/people', (req, res, next) => {
	res.status(200).send(data.getPeople());
});

router.get('/ping', (req, res) => {
  res.json({pong: Date.now()})
});

router.use('/leagues', leagueRouter.routes);
router.get('/*', notFoundMiddleware);

export const routes = router;