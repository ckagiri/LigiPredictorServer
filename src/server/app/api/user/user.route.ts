import {Router} from 'express';
import {UserController} from './user.controller';

let router = Router();

class UserRouter {
    private controller: UserController = new UserController();

    get routes () {
        router.get('/', this.controller.list);
        router.get('/:id', this.controller.show)
        return router;
    }
}

export const userRouter = new UserRouter();