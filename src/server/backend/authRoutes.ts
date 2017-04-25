import {Router} from 'express';
import { send404, notFoundMiddleware } from './utils/notfound'; 
import * as authGoogle from "./auth/auth.google";
import * as authFacebook from './auth/auth.facebook';
import * as authLocal from './auth/auth.local';
import {ensureAuthenticated, unlink} from './auth/helpers';

const router = Router();

router.post('/google', authGoogle.googleAuth);
router.post('/facebook', authFacebook.facebookAuth);
router.post('/signup', authLocal.signup);
router.post('/login', authLocal.login);
router.post('/unlink', ensureAuthenticated, unlink)
router.get('/*', notFoundMiddleware);

export const routes = router;