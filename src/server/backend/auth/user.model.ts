import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

export interface IUser {
	email: string,
  password: string,
	userName: string,
	displayName: String,
  picture: string,
	comparePassword: any,
  facebook: string,
  google: string,
  twitter: string
}

export interface IUserModel extends IUser, mongoose.Document { }

let userSchema = new Schema({
  email: { 
		type: String, 
		unique: true, 
		lowercase: true 
	},
  password: { 
		type: String, 
		select: false 
	},
	displayName: String,
  userName:  { 
		type: String, 
		unique: true
	},
  picture: String,
  facebook: String,
  google: String,
  twitter: String
});

userSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password: string, done: Function) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

export const User = mongoose.model<IUserModel>('User', userSchema);