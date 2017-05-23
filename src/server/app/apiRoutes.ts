import {Router} from 'express';
import {profileRouter} from './api/user/profile';
import {leagueRouter} from './api/league/league.route';
import {fixtureRouter} from './api/fixture/fixture.route';
import { send404, notFoundMiddleware } from './utils/notfound'; 
import {ensureAuthenticated} from './auth/helpers';

const router = Router();

router.get('/ping', (req, res) => {
  res.json({pong: Date.now()})
});

router.use('/me', profileRouter.routes);
router.use('/leagues', leagueRouter.routes);
router.use('/matches', ensureAuthenticated, fixtureRouter.routes)
router.get('/*', notFoundMiddleware);

export const routes = router;