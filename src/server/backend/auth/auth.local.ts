import {Request, Response} from 'express';
import {User} from './user.model';
import {createJWT} from './oauth';

export function login(req: Request, res: Response) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err: any, isMatch: any) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      var token = createJWT(user);
			var userObj:any = user.toObject();
      delete userObj.password;

      res.send({ token: token, user: userObj });
    });
  });
}

export function signup(req: Request, res: Response) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
			var token = createJWT(user);
			var userObj:any = user.toObject();
      delete userObj.password;
			
			res.send({ token: token, user: userObj });
    });
  });
}