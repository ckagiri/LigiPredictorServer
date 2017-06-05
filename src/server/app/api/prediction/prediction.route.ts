import {Router} from 'express';
import {PredictionController} from './prediction.controller';

let router = Router();

class PredictionRouter {
  private controller: PredictionController = new PredictionController();

  get routes () {
    router.get('/mine', this.controller.list);
    router.get('/:id', this.controller.show)
    router.post('/', this.controller.create)
    return router;
  }   
}

export const predictionRouter = new PredictionRouter();