import * as moment from 'moment';
import * as jwt from 'jwt-simple';
import {Router, Request, Response, NextFunction} from 'express';
import {config} from '../../config/environment';
import {IUserModel, User} from './user.model';

export function createJWT(user: IUserModel) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req['user'] = payload.sub;
  next();
}

export function unlink(req: Request, res: Response) {
  var provider = req.body.provider;
  var providers = ['facebook', 'google'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req['user'], function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
}