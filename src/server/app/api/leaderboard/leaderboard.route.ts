import {Router} from 'express';
import {LeaderboardController} from '../leaderboard/leaderboard.controller'

let router = Router();

class LeaderboardRouter {
    private controller: LeaderboardController = new LeaderboardController();

    get routes () {
        router.get('/', this.controller.seasonList);
        router.get('/current-defaults', this.controller.currentDefaults)
        router.get('/league/:league/season/:season', this.controller.seasonList);
        router.get('/league/:league/season/:season/round/:round', this.controller.seasonRoundList)
        router.get('/league/:league/season/:season/year/:year/month/:month', this.controller.seasonMonthList)
        router.get('/:id', this.controller.show)
        return router;
    }
}

export const leaderboardRouter = new LeaderboardRouter();