import {Router} from 'express';
import {LeagueController} from './league.controller';
import {SeasonController} from '../season/season.controller'

let router = Router();

class LeagueRouter {
    private controller: LeagueController = new LeagueController();

    get routes () {
        router.get('/', this.controller.list);
				router.get('/:id', this.controller.show)
        return router;
    }
}

export const leagueRouter = new LeagueRouter();