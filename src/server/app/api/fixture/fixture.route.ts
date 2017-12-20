import {Router} from 'express';
import {FixtureController} from './fixture.controller';

let router = Router();

class FixtureRouter {
    private controller: FixtureController = new FixtureController();

    get routes () {
        router.get('/', this.controller.list);
        router.get('/predictions', this.controller.predictions)
        router.get('/live', this.controller.live)
        router.get('/:id', this.controller.show)
        return router;
    }
}

export const fixtureRouter = new FixtureRouter();