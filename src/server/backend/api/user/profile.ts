import {Router, Request, Response} from 'express';
import * as moment from 'moment';
import * as jwt from "jwt-simple";
import {ensureAuthenticated} from '../../auth/helpers';
import {config} from '../../../config/environment';
import {User} from '../../auth/user.model';
let router = Router();

class ProfileRouter {
	get routes () {
		router.get('/me', ensureAuthenticated, function(req, res) {
			User.findById(req['user'], function(err, user) {
				res.send(user);
			});
		});
		router.put('/me', ensureAuthenticated, function(req, res) {
			User.findById(req['user'], function(err, user) {
				if (!user) {
					return res.status(400).send({ message: 'User not found' });
				}
				user.displayName = req.body.displayName || user.displayName;
				user.email = req.body.email || user.email;
				user.save(function(err) {
					res.status(200).end();
				});
			});
		});
		return router;
	}
}

export const profileRouter = new ProfileRouter();