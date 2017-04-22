import {Router} from 'express';
import { send404, notFoundMiddleware } from './utils/notfound'; 

const router = Router();

router.get('/*', notFoundMiddleware);

export const routes = router;