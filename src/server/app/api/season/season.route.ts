import {Router} from 'express';
import {SeasonController} from '../season/season.controller'

let router = Router();

class SeasonRouter {
    private controller: SeasonController = new SeasonController();

    get routes () {
        router.get('/', this.controller.list);
        router.get('/:id', this.controller.show)
        return router;
    }
}

export const seasonRouter = new SeasonRouter();