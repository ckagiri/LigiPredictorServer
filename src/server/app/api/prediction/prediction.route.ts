import {Router} from 'express';
import {PredictionController} from './prediction.controller';

let router = Router();

class PredictionRouter {
  private controller: PredictionController = new PredictionController();

  get routes () {
    router.get('/', this.controller.list);
    router.get('/mine', this.controller.mine);
    router.post('/pick-joker', this.controller.pickJoker)
    router.get('/:id', this.controller.show)
    router.post('/', this.controller.create)
    return router;
  }   
}

export const predictionRouter = new PredictionRouter();