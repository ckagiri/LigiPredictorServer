import {Request, Response} from 'express';
import * as request from 'request';
import * as jwt from 'jwt-simple';
import {config} from '../../config/environment';
import {User} from '../../db/models/user.model';
import {createJWT} from './helpers';

export function googleAuth(req: Request, res: Response) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
						user.displayName = user.displayName || profile.name;
            user.email = user.email || profile.email;
            user.save(function(err, savedUser) {
              if (err) {
                res.status(500).send({ message: err.message });
              }
              var token = createJWT(savedUser);
              res.send({ token: token, user: savedUser });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
						var token = createJWT(existingUser);
            return res.send({ token: token, user: existingUser });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.email = profile.email;
          user.userName = profile.email;
          user.save(function(err, savedUser) {
            if (err) {
              res.status(500).send({ message: err.message });
            }
            var token = createJWT(savedUser);
            res.send({ token: token, user: savedUser });
          });
        });
      }
    });
  });
}