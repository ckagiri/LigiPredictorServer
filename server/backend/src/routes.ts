import {Router} from 'express';
import {leagueRouter} from './api/league/league.route';

const router = Router();

router.get('/ping', (req, res) => {
  res.json({pong: Date.now()})
});

router.use('/leagues', leagueRouter.routes);

export const routes = router;