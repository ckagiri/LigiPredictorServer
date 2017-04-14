import {Router} from 'express';
import {LeagueController} from './league.controller';

let router = Router();

class LeagueRouter {
    private controller: LeagueController = new LeagueController();

    get routes () {
        router.get('/', this.controller.list);
        router.get('/:id', this.controller.show);
        router.post('/', this.controller.create);
        router.put('/:id', this.controller.update);
        router.patch('/:id', this.controller.update);
        router.delete('/:id', this.controller.destroy);

        return router;
    }
}

export const leagueRouter = new LeagueRouter();