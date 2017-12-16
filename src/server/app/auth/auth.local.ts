import {Request, Response} from 'express';
import {User} from '../../db/models/user.model';
import {createJWT} from './helpers';

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
      res.send({ token: token, user: user });
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
    user.save(function(err, savedUser) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      var token = createJWT(savedUser);
      res.send({ token: token, user: savedUser });
    });
  });
}

export function sendMailAddressConfirmationEmail() {

}

export function confirmMailAddress() {

}

export function resetPassword() {

} 

 export function confirmPasswordReset() {
   
 }