import {Router} from 'express';
import {profileRouter} from './api/user/profile';
import {userRouter} from './api/user/user.route';
import {leagueRouter} from './api/league/league.route';
import {fixtureRouter} from './api/fixture/fixture.route';
import {predictionRouter} from './api/prediction/prediction.route';
import {leaderboardRouter} from './api/leaderboard/leaderboard.route';
import {seasonRouter} from './api/season/season.route';
import { adminRouter } from './api/admin/admin.route';
import { send404, notFoundMiddleware } from './utils/notfound'; 
import {ensureAuthenticated, attachUser} from './auth/helpers';

const router = Router();

router.get('/ping', (req, res) => {
  res.json({pong: Date.now()})
});

router.use('/admin', adminRouter.routes)
router.use('/me', profileRouter.routes);
router.use('/users', userRouter.routes);
router.use('/leagues', leagueRouter.routes);
router.use('/seasons', seasonRouter.routes);
router.use('/matches', attachUser, fixtureRouter.routes)
router.use('/predictions', attachUser, predictionRouter.routes)
router.use('/leaderboard', attachUser, leaderboardRouter.routes)
router.get('/*', notFoundMiddleware);

export const routes = router;