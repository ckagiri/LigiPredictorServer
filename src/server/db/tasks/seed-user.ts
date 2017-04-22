process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as async from 'async';
import * as mongoose from 'mongoose';
import {User, IUserModel} from '../../backend/auth/user.model'
import {config} from '../../config/environment';

const Promise = require('bluebird'); 
(<any>mongoose).Promise = Promise;

//Add user to the system
var user1 = new User({
	userName: "ckagiri",
	displayName: "Charles Kagiri",
	email: "charleskagiri@gmail.com",
	password: "redwire",
	roles: ["admin"]
});

import {connect} from './common';

function seedUser() {
  console.log('Seeding user.');
  mongoose.connect(config.mongo.uri);
    console.log(config.mongo.uri);
		user1.save((err) => {
			if (err) {
				console.log(err.message)
			}
		});
    mongoose.connection.close();
} 

seedUser();