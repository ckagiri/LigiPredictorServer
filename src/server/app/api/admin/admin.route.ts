import {Router} from 'express';
import {AdminController} from './admin.controller';

let router = Router();

class AdminRouter {
    private controller: AdminController = new AdminController();

    get routes () {
        router.get('/afd/next-update', this.controller.nextMatchUpdate);
        router.get('/afd/fixture/:id', this.controller.showAfdFixture);
        router.get('/afd/fixtures/:matchday', this.controller.showAfdMatchdayFixtures)
        return router;
    }
}

export const adminRouter = new AdminRouter();